# Troubleshooting Guide: Postgres Error 21000 (cardinality_violation) in Supabase

## Introduction

PostgreSQL error `21000`, also known as `cardinality_violation`, occurs when a query or part of a query that is expected to return a single row (or a specific number of rows) actually returns more rows than expected. This can happen in various contexts, such as subqueries, function calls, or when inserting data that violates unique constraints if not handled correctly.

This guide is specifically tailored for Supabase users, aiming to help you identify the root cause of error 21000 within your Supabase projects and provide actionable solutions to resolve it. Understanding and addressing this error is crucial for maintaining data integrity and application stability.

The goal of this guide is to walk you through common scenarios leading to this error in a Supabase environment, how to debug them, and how to implement fixes.

## Common Causes and Solutions

Below are common reasons for encountering the `cardinality_violation` error, along with Supabase-specific contexts and solutions.

---

### 1. Unique Constraint Violation (Implicitly)

While often leading to `23505 (unique_violation)`, if your application logic or ORM expects a single row from an operation that *could* return multiple due to a unique constraint (e.g., an `INSERT ... RETURNING` that isn't properly constrained or an ORM trying to fetch a single record by a non-unique key that you thought was unique), it can sometimes manifest as a cardinality issue from the client's perspective if it's not prepared to handle multiple returned rows where it expected one. More directly, an `INSERT ... ON CONFLICT ... DO UPDATE ... RETURNING ...` where the `WHERE` clause of the `DO UPDATE` part unexpectedly matches multiple rows could be a source.

*   **Explanation:** You're attempting an operation that implies a single affected/returned row, but a background unique constraint or a complex `ON CONFLICT` clause results in more than one row being processed or returned in a way that violates the expectation of a single-row result.
*   **Supabase Context:**
    *   Inserting a user with an email that already exists if your client-side logic or an RPC function expects only one user record to be returned or processed after the insert.
    *   Using `upsert` operations with `RETURNING` clauses where the conflict target might not be specific enough in complex scenarios, or the update part affects more rows than anticipated.
*   **Solution:**
    *   **Identify the Constraint:** Determine which unique constraint is being violated or causing multiple rows to be processed. Check your table schema in the Supabase Dashboard (Database > Tables).
    *   **Application Logic:**
        *   Ensure your application logic checks for existing records *before* attempting an insert if a unique value is required and you want to handle it customly.
        *   For Supabase client libraries:
            ```javascript
            // Example: Checking if a user exists before inserting
            const { data: existingUser, error: fetchError } = await supabase
              .from('profiles')
              .select('id')
              .eq('username', 'new_username')
              .maybeSingle(); // Expects one or zero

            if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116: Row not found (expected)
              console.error('Error fetching user:', fetchError);
              return;
            }

            if (existingUser) {
              console.log('Username already exists.');
              // Handle duplicate username
            } else {
              const { data: newUser, error: insertError } = await supabase
                .from('profiles')
                .insert({ username: 'new_username', email: 'user@example.com' })
                .select()
                .single(); // Expects a single row to be inserted and returned

              if (insertError) {
                console.error('Error inserting profile:', insertError);
                // Check for unique_violation (23505) or other errors
              } else {
                console.log('New profile created:', newUser);
              }
            }
            ```
    *   **Use `ON CONFLICT` Wisely:**
        *   If you intend to ignore duplicates: `INSERT INTO your_table (unique_column, data) VALUES ('value', 'some_data') ON CONFLICT (unique_column) DO NOTHING;`
        *   If you intend to update existing rows: `INSERT INTO your_table (unique_column, data, other_column) VALUES ('value', 'new_data', 'other_val') ON CONFLICT (unique_column) DO UPDATE SET data = EXCLUDED.data, last_updated = NOW() RETURNING *;`
            *   Ensure the `RETURNING *` (or specific columns) is handled correctly by your application; if it might return multiple rows due to concurrent updates or complex conflict targets, ensure the receiver expects an array.
    *   **Supabase Client with `upsert`:**
        ```javascript
        // Upserting data - careful if your RLS or table structure could lead to multiple rows being returned where client expects one.
        const { data, error } = await supabase
          .from('products')
          .upsert({ id: 1, name: 'New Product Name' }) // Uses primary key for conflict by default
          .select()
          .single(); // Add .single() if you expect one row back

        if (error) {
          console.error('Upsert error:', error); // This could be 21000 if `upsert` somehow returns multiple rows and `.single()` is used.
        }
        ```

---

### 2. Single Row Expected, Multiple Rows Returned (Subqueries or Functions)

This is the most direct cause of `cardinality_violation`.

*   **Explanation:** A subquery used in a place where only a single scalar value is expected (e.g., in a `SELECT` list, as an operand to a comparison operator like `=`, `>`, or as an argument to a function that expects a single value) returns more than one row. Similarly, a PL/pgSQL function defined to `RETURNS sometype` (scalar) executes a query that yields multiple rows.
*   **Supabase Context:**
    *   A Supabase RPC function (Database > Functions) is defined with `RETURNS integer` or `RETURNS text`, but the SQL query inside it (e.g., `SELECT id FROM items WHERE category = 'A'`) returns multiple IDs.
    *   A view (Database > Views) is defined, and then you query it in a way that expects a single result, but the view's underlying logic combined with your query returns multiple rows.
    *   A subquery within a larger query written in the SQL Editor or via the client library.
*   **Solution:**
    *   **Analyze the Subquery/Function:**
        *   Isolate the problematic subquery or function.
        *   Run it directly in the Supabase SQL Editor with the same parameters that cause the error.
    *   **Ensure Single Row Return:**
        *   **`LIMIT 1`:** If any arbitrary single row is acceptable: `(SELECT column FROM table WHERE condition LIMIT 1)`.
        *   **Specific `WHERE` Clauses:** Refine your `WHERE` clauses to ensure uniqueness.
        *   **Aggregate Functions:** If you need a value derived from multiple rows (e.g., the maximum, minimum, average, sum, count): `(SELECT MAX(price) FROM products WHERE category_id = 1)`.
        *   **`array_agg()` or `json_agg()`:** If you intend to return multiple values, return them as an array or JSON: `RETURNS INT[]` and use `SELECT array_agg(id) FROM ...`.
    *   **Modify Calling Query:**
        *   If the subquery *should* return multiple rows, change the calling query to handle them (e.g., use `IN`, `ANY`, `ALL`, `EXISTS`):
            ```sql
            -- Instead of: SELECT * FROM orders WHERE user_id = (SELECT id FROM users WHERE country = 'USA'); -- Fails if multiple US users
            -- Use:
            SELECT * FROM orders WHERE user_id IN (SELECT id FROM users WHERE country = 'USA');
            ```
    *   **Supabase RPC Function Example:**
        ```sql
        -- Problematic Function:
        CREATE OR REPLACE FUNCTION get_user_points(user_id_param int)
        RETURNS int AS $$
        BEGIN
          RETURN (SELECT points FROM game_scores WHERE user_id = user_id_param); -- Fails if user has multiple scores
        END;
        $$ LANGUAGE plpgsql;

        -- Solution 1: Return sum of points (if that's the logic)
        CREATE OR REPLACE FUNCTION get_user_total_points(user_id_param int)
        RETURNS int AS $$
        DECLARE
          total_points int;
        BEGIN
          SELECT SUM(points) INTO total_points FROM game_scores WHERE user_id = user_id_param;
          RETURN total_points;
        END;
        $$ LANGUAGE plpgsql;

        -- Solution 2: Return points from latest score (if that's the logic)
        CREATE OR REPLACE FUNCTION get_latest_user_points(user_id_param int)
        RETURNS int AS $$
        DECLARE
          latest_points int;
        BEGIN
          SELECT points INTO latest_points FROM game_scores
          WHERE user_id = user_id_param
          ORDER BY created_at DESC
          LIMIT 1;
          RETURN latest_points;
        END;
        $$ LANGUAGE plpgsql;
        ```
    *   **Supabase Client Debugging RPCs:**
        ```javascript
        const { data, error } = await supabase.rpc('get_user_points', { user_id_param: 123 });

        if (error) {
          console.error('RPC Error:', error); // Check for code 21000
          // If so, debug the 'get_user_points' function in Supabase SQL Editor
        }
        ```

---

### 3. Incorrect Use of Array Constructors or Functions

*   **Explanation:** Assigning an array with multiple elements to a scalar (non-array) column or variable, or using array functions in a way that violates cardinality expectations in the context of the query.
*   **Supabase Context:**
    *   Trying to set a `text` column with an array of text values directly.
    *   A PL/pgSQL function in Supabase expects a single value but receives an array, or incorrectly processes an array leading to multiple outputs where one is expected.
*   **Solution:**
    *   **Verify Column Types:** Ensure the data you're inserting or updating matches the column's data type. If the column is `text`, you cannot directly assign `ARRAY['a', 'b']` to it.
    *   **Unnest Arrays Correctly:** If you need to process elements of an array as individual rows, use `UNNEST()` in a subquery or CTE, and ensure the outer query handles these multiple rows appropriately.
        ```sql
        -- Example: If a function needs to process items from an array and insert them
        -- Assuming a function that takes an array of tags and is supposed to return a single status,
        -- but internally tries to do something like:
        -- SELECT some_check(tag_name) FROM tags WHERE tag_name IN (SELECT UNNEST(my_array_param));
        -- This subquery to some_check might return multiple rows if not aggregated.
        ```
    *   **Check Array Parameters in RPCs:** If your RPC function accepts an array (e.g., `param_tags text[]`), ensure the logic within the function correctly handles array processing, especially if it then tries to return a single scalar value based on that array.

---

### 4. Triggers Returning Multiple Rows Incorrectly

*   **Explanation:** A row-level trigger function is expected to return a single row (`NEW` for `INSERT`/`UPDATE` before/after, `OLD` for `DELETE` before/after, or `NULL` to skip the operation in some cases). If the trigger logic mistakenly executes a query that returns multiple rows and attempts to return that result set, it will cause a cardinality_violation.
*   **Supabase Context:** Custom trigger functions created via the Supabase Dashboard (Database > Triggers) or SQL.
*   **Solution:**
    *   **Review Trigger Function Logic:**
        *   Ensure the trigger function's final `RETURN` statement provides a single record (e.g., `RETURN NEW;`, `RETURN OLD;`).
        *   Any queries within the trigger that are used to modify `NEW` or for decision-making should not be directly returned if they produce multiple rows. If you need data from such a query, assign it to variables or use it in conditions carefully.
        ```sql
        -- Problematic Trigger Snippet (Conceptual)
        CREATE OR REPLACE FUNCTION my_trigger_func()
        RETURNS TRIGGER AS $$
        BEGIN
          -- If this select somehow is returned by the trigger
          -- and it fetches multiple rows, it's an issue.
          -- RETURN QUERY SELECT * FROM another_table WHERE condition; -- INCORRECT for most triggers

          -- Correct approach: Modify NEW record or perform actions
          NEW.some_column = NEW.some_column || ' (modified)';
          RETURN NEW;
        END;
        $$ LANGUAGE plpgsql;
        ```
    *   **Test Triggers:** Test the trigger behavior by making changes to the associated table and observing the outcome or any errors in Postgres logs.

---

### 5. RLS Policies Causing Unexpected Filtering or Complex Subqueries

*   **Explanation:**
    *   **Filtering to Zero:** While `21000` is typically about *too many* rows, if your query structure (especially with ORMs or client libraries expecting a single specific row, like `.single()` in Supabase JS) encounters a situation where RLS filters out the *expected* row, the subsequent logic might behave erratically. This isn't a direct 21000 but can be a related symptom if the code isn't robust to "not found" vs. "found many."
    *   **RLS Subquery Cardinality:** More directly, if your RLS policy itself contains a subquery that must return a single boolean value (or a single value for comparison), and that subquery accidentally returns multiple rows, this can cause errors, potentially `21000`, when the policy is evaluated.
*   **Supabase Context:** Row Level Security policies defined on your tables.
*   **Solution:**
    *   **Test with RLS Disabled (Temporarily):** For debugging, you can *briefly* disable RLS for a specific user or in a test environment to see if the error disappears. **Remember to re-enable it.**
        ```sql
        -- For a session, to test as a superuser (bypasses RLS)
        SET ROLE postgres;
        -- Run your query
        RESET ROLE;
        ```
    *   **Review RLS Policy Definitions:**
        *   Go to Authentication > Policies in the Supabase Dashboard.
        *   Examine the `USING` and `WITH CHECK` expressions. If they contain subqueries, ensure these subqueries always return a single scalar value (often boolean, or a single ID to check against).
        *   Example of a potentially problematic RLS subquery:
            ```sql
            -- Policy: Allow select if user is in ANY of the groups associated with a document
            -- (USING (EXISTS (SELECT 1 FROM document_groups dg WHERE dg.doc_id = id AND dg.group_id IN (SELECT group_id FROM user_groups WHERE user_id = auth.uid()))))
            -- The subquery `(SELECT group_id FROM user_groups WHERE user_id = auth.uid())` is fine.
            -- But if an RLS policy was structured like:
            -- (USING ( (SELECT group_type FROM groups WHERE id = some_column_from_table) = 'admin' ))
            -- This would fail with 21000 if `(SELECT group_type FROM groups WHERE id = some_column_from_table)` returned multiple group_types for a single `some_column_from_table.id`.
            ```
    *   **Simplify RLS Policies:** Break down complex RLS rules into simpler ones or use helper functions (that are themselves robust against cardinality issues).
    *   **Use `EXPLAIN` with RLS:** Analyzing query plans while RLS is active can sometimes give clues.

## General Debugging Steps in Supabase

*   **Check Supabase Logs:**
    *   Navigate to "Logs" > "Postgres Logs" in your Supabase project dashboard.
    *   Look for entries around the time the error occurred. The log might provide the exact query or function that failed.
*   **Simplify the Query:**
    *   If the error comes from a complex query, break it into smaller parts. Test each part individually in the Supabase SQL Editor (Project > SQL Editor) until you find the component returning an unexpected number of rows.
*   **Use `EXPLAIN` and `EXPLAIN ANALYZE`:**
    *   Prefix your query with `EXPLAIN` to see the query plan. This shows how Postgres intends to execute the query.
    *   Use `EXPLAIN ANALYZE` to execute the query and see the actual plan with row counts. This is invaluable for finding where unexpected rows are coming from.
    *   You can use this in the Supabase SQL Editor.
        ```sql
        EXPLAIN ANALYZE SELECT * FROM your_table WHERE id = (SELECT user_id FROM profiles WHERE email = 'test@example.com');
        ```
*   **Test in SQL Editor:**
    *   The Supabase SQL Editor is your best friend for debugging. Replicate the failing operation as closely as possible.
*   **Check Data Directly:**
    *   Inspect the data in your tables using the Table Editor or SQL queries. Are there duplicates where you don't expect them? Is data missing that would make a query return one row?
*   **Review Recent Changes:**
    *   Did the error start appearing after a recent schema change, data import, deployment of a new RPC function, or change in RLS policy? Revert or inspect recent changes.
*   **Isolate with Client Libraries:**
    *   If using `supabase-js` or other client libraries:
        *   Log the exact parameters being sent.
        *   Many Supabase client methods have an `.explain()` option that can help show what kind of query is being built, sometimes even including estimated row counts or plans.
            ```javascript
            const { data, error, count, status, ...rest } = await supabase
              .from('your_table')
              .select('some_column')
              .eq('id', (await supabase.rpc('get_id_that_might_return_many')).data) // Example of potential issue
              .explain(); // Check the output of explain

            console.log(rest.body.plan); // The plan might be here
            ```

## Supabase Specific Considerations

*   **RPC Functions:**
    *   **`RETURNS` Clause:** Double-check the `RETURNS` type (e.g., `SETOF record`, `TABLE(...)`, `sometype`, `SETOF sometype`). Ensure it matches what the function body actually produces.
    *   **`RETURN QUERY`:** If using `RETURN QUERY SELECT ...`, ensure this select statement is what you intend. If the function `RETURNS sometype` (scalar), then `RETURN QUERY` must return exactly one row and one column of that type.
    *   **Implicit `SELECT` in PL/pgSQL:** When you assign a `SELECT` to a variable in PL/pgSQL (`my_var := (SELECT col FROM ...);`), it must return a single row. Use `SELECT col INTO my_var FROM ... LIMIT 1;` if you need to enforce this.
*   **Database Webhooks / Edge Functions:**
    *   If these functions are invoked and then perform database operations, trace the execution flow. An error in a webhook or Edge Function interacting with Postgres could be the source. Check their logs.
*   **Realtime:**
    *   While less likely to directly cause `21000` from a Realtime subscription itself, database changes made *in response* to Realtime events (e.g., via a trigger or function called by your application backend) need to be robust.

## When to Seek Help

If you've diligently gone through this guide, checked your Supabase Postgres logs, simplified queries, and are still unable to pinpoint the cause of the `21000 cardinality_violation` error, it might be time to seek further assistance.

*   **Supabase Support:** You can reach out to Supabase support via their official channels (e.g., through your project dashboard or their website).
*   **Supabase Community:** The Supabase Discord or GitHub Discussions can be great places to ask for help.
*   **Provide Details:** When asking for help, include:
    *   The full error message, including the error code (`21000`).
    *   The problematic SQL query or function definition.
    *   Relevant table schemas (CREATE TABLE statements).
    *   Relevant RLS policies if you suspect they are involved.
    *   The context in which the error occurs (e.g., calling an RPC, inserting a row, running a specific client-side operation).
    *   What you've already tried based on this guide.

## Conclusion

Postgres error `21000 (cardinality_violation)` is a common issue when the database returns an unexpected number of rows for an operation that anticipates a specific count (usually one). By carefully examining your queries, functions, triggers, and RLS policies, especially in the context of Supabase's tools and features, you can effectively troubleshoot and resolve this error.

Always aim for explicitness in your queries and function definitions regarding expected row counts. Use aggregates, `LIMIT`, or refined `WHERE` clauses when a single row is necessary, and ensure your application logic correctly handles cases where multiple rows are legitimately returned.
