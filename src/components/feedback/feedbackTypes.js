export const FEEDBACK_TYPES = {
  bug: {
    id: 'bug',
    label: 'Bug Report',
    subtitle: 'Something isn\'t working correctly',
    placeholder: 'Describe the bug you encountered...',
    icon: 'mdi:bug',
  },
  feature: {
    id: 'feature',
    label: 'Feature Idea',
    subtitle: 'Suggest a new feature or improvement',
    placeholder: 'Describe your feature idea...',
    icon: 'mdi:lightbulb',
  },
  feedback: {
    id: 'feedback',
    label: 'User Feedback',
    subtitle: 'Share your thoughts or experience',
    placeholder: 'Share your thoughts or suggestions...',
    icon: 'mdi:comment-text',
  },
  question: {
    id: 'question',
    label: 'Question',
    subtitle: 'Ask us anything',
    placeholder: 'What would you like to know?',
    icon: 'mdi:help-circle',
  },
};

export const FEEDBACK_TYPE_LIST = Object.values(FEEDBACK_TYPES);
