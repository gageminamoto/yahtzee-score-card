/* global process */
export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { type, message, screenshot, userAgent, timestamp } = req.body;

  // Validate required fields
  if (!type || !message) {
    return res.status(400).json({ error: 'Type and message are required' });
  }

  // Get environment variables
  const notionApiKey = process.env.NOTION_API_KEY;
  const notionDatabaseId = process.env.NOTION_DATABASE_ID;

  if (!notionApiKey || !notionDatabaseId) {
    console.error('Missing Notion API configuration');
    return res.status(500).json({ error: 'Server configuration error' });
  }

  try {
    // Build the page properties
    const properties = {
      'Title': {
        title: [
          {
            text: {
              content: `[${type}] ${message.slice(0, 50)}${message.length > 50 ? '...' : ''}`,
            },
          },
        ],
      },
      'Type': {
        select: {
          name: type,
        },
      },
      'Message': {
        rich_text: [
          {
            text: {
              content: message.slice(0, 2000), // Notion has a 2000 char limit per text block
            },
          },
        ],
      },
      'User Agent': {
        rich_text: [
          {
            text: {
              content: userAgent || 'Unknown',
            },
          },
        ],
      },
      'Submitted At': {
        date: {
          start: timestamp || new Date().toISOString(),
        },
      },
      'Status': {
        select: {
          name: 'New',
        },
      },
    };

    // Create the page in Notion
    const response = await fetch('https://api.notion.com/v1/pages', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${notionApiKey}`,
        'Content-Type': 'application/json',
        'Notion-Version': '2022-06-28',
      },
      body: JSON.stringify({
        parent: { database_id: notionDatabaseId },
        properties,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Notion API error:', errorData);
      return res.status(500).json({ error: 'Failed to submit feedback to Notion' });
    }

    const pageData = await response.json();

    // If there's a screenshot, upload it as a file to the page
    if (screenshot) {
      try {
        // Notion's API doesn't support direct file uploads
        // We'll add a callout block noting that a screenshot was attached
        // For full screenshot support, integrate with S3, Cloudinary, or similar
        if (screenshot.startsWith('data:image/')) {
          await fetch(`https://api.notion.com/v1/blocks/${pageData.id}/children`, {
            method: 'PATCH',
            headers: {
              'Authorization': `Bearer ${notionApiKey}`,
              'Content-Type': 'application/json',
              'Notion-Version': '2022-06-28',
            },
            body: JSON.stringify({
              children: [
                {
                  object: 'block',
                  type: 'callout',
                  callout: {
                    rich_text: [
                      {
                        type: 'text',
                        text: {
                          content: 'Screenshot attached (base64 encoded in original submission)',
                        },
                      },
                    ],
                    icon: {
                      type: 'emoji',
                      emoji: '📎',
                    },
                  },
                },
              ],
            }),
          });
        }
      } catch (screenshotError) {
        console.error('Error handling screenshot:', screenshotError);
        // Don't fail the whole request if screenshot handling fails
      }
    }

    return res.status(200).json({ success: true, pageId: pageData.id });
  } catch (error) {
    console.error('Error submitting feedback:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
