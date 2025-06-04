import { Confession, Category, CategoryInfo } from '../types';

// Category definitions with fun colors and descriptions
export const CATEGORIES: Record<Category, CategoryInfo> = {
  'procrastination': {
    value: 'procrastination',
    label: 'Epic Procrastination',
    description: 'Tales of legendary last-minute victories',
    color: 'bg-blue-500',
  },
  'food-adventures': {
    value: 'food-adventures',
    label: 'Food Adventures',
    description: 'Epic cafeteria quests and snack discoveries',
    color: 'bg-pink-500',
  },
  'nap-expertise': {
    value: 'nap-expertise',
    label: 'Nap Mastery',
    description: 'The art of tactical power naps',
    color: 'bg-green-500',
  },
  'awkward-moments': {
    value: 'awkward-moments',
    label: 'Awkward Moments',
    description: 'Those hilariously embarrassing stories',
    color: 'bg-purple-500',
  },
  'campus-legends': {
    value: 'campus-legends',
    label: 'Campus Legends',
    description: 'Wild stories and campus myths',
    color: 'bg-yellow-500',
  },
  'future-plans': {
    value: 'future-plans',
    label: 'Future "Plans"',
    description: 'Totally realistic life goals (wink wink)',
    color: 'bg-orange-500',
  },
  'random': {
    value: 'random',
    label: 'Random Thoughts',
    description: '3 AM shower thoughts and wild ideas',
    color: 'bg-gray-500',
  },
};

// Helper function to create an expiration date (30 days from creation)
const createExpirationDate = (creationDate: Date): Date => {
  const expirationDate = new Date(creationDate);
  expirationDate.setDate(expirationDate.getDate() + 30);
  return expirationDate;
};

// Generate sample confessions
export const generateInitialConfessions = (): Confession[] => {
  const today = new Date();
  
  return [
    {
      id: '1',
      content: "I've mastered the art of looking awake in class while being completely asleep. My secret? Strategic hoodie positioning and fake glasses with eyes drawn on them. 😴",
      category: 'nap-expertise',
      createdAt: new Date(today.getTime() - 2 * 24 * 60 * 60 * 1000),
      expiresAt: createExpirationDate(new Date(today.getTime() - 2 * 24 * 60 * 60 * 1000)),
      hasTriggerWarning: false,
      supportCount: 42,
      isReported: false,
      comments: [
        {
          id: '101',
          content: "You're living in 3025 while we're all stuck in 2025! 🚀",
          createdAt: new Date(today.getTime() - 1 * 24 * 60 * 60 * 1000),
          supportCount: 12,
        },
        {
          id: '102',
          content: "Please share your wisdom with us, oh great nap master! 🙏😴",
          createdAt: new Date(today.getTime() - 12 * 60 * 60 * 1000),
          supportCount: 8,
        },
      ],
    },
    {
      id: '2',
      content: "Just spent my entire budget on instant ramen. Currently calculating how many flavors I need to try before I can claim to be a 'ramen connoisseur' on my resume. 🍜",
      category: 'food-adventures',
      createdAt: new Date(today.getTime() - 5 * 24 * 60 * 60 * 1000),
      expiresAt: createExpirationDate(new Date(today.getTime() - 5 * 24 * 60 * 60 * 1000)),
      hasTriggerWarning: false,
      supportCount: 56,
      isReported: false,
      comments: [
        {
          id: '201',
          content: "Pro tip: Add an egg and suddenly it's gourmet! 🥚✨",
          createdAt: new Date(today.getTime() - 4 * 24 * 60 * 60 * 1000),
          supportCount: 18,
        },
      ],
    },
    {
      id: '3',
      content: "My roommate thinks our dorm is haunted because their socks keep disappearing. Plot twist: it's just the chaotic void under their bed eating everything. 👻🧦",
      category: 'campus-legends',
      createdAt: new Date(today.getTime() - 1 * 24 * 60 * 60 * 1000),
      expiresAt: createExpirationDate(new Date(today.getTime() - 1 * 24 * 60 * 60 * 1000)),
      hasTriggerWarning: false,
      supportCount: 104,
      isReported: false,
      comments: [
        {
          id: '301',
          content: "The sock monster is real and you can't convince me otherwise! 🧦👹",
          createdAt: new Date(today.getTime() - 12 * 60 * 60 * 1000),
          supportCount: 24,
        },
      ],
    },
    {
      id: '4',
      content: "My 5-year plan: 1) Graduate 2) Become a professional pizza taster 3) ??? 4) Success! My academic advisor was not impressed, but I stand by my dream. 🍕",
      category: 'future-plans',
      createdAt: new Date(today.getTime() - 3 * 24 * 60 * 60 * 1000),
      expiresAt: createExpirationDate(new Date(today.getTime() - 3 * 24 * 60 * 60 * 1000)),
      hasTriggerWarning: false,
      supportCount: 28,
      isReported: false,
      comments: [
        {
          id: '401',
          content: "Step 3 is clearly 'Start a pizza review TikTok' - duh! 📱🍕",
          createdAt: new Date(today.getTime() - 2 * 24 * 60 * 60 * 1000),
          supportCount: 15,
        },
      ],
    },
    {
      id: '5',
      content: "Just wrote an entire essay about why procrastination should be considered a professional skill. Started it 30 minutes before the deadline, naturally. 😎⏰",
      category: 'procrastination',
      createdAt: new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000),
      expiresAt: createExpirationDate(new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)),
      hasTriggerWarning: false,
      supportCount: 89,
      isReported: false,
      comments: [
        {
          id: '501',
          content: "The adrenaline rush of a deadline is the only way to unlock maximum brain power! 🧠⚡",
          createdAt: new Date(today.getTime() - 6 * 24 * 60 * 60 * 1000),
          supportCount: 41,
        },
      ],
    },
  ];
};