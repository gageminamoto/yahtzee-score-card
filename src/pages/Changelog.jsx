/**
 * Changelog page that displays releases from GitHub
 * Fetches release data from the GitHub API
 */

import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Icon } from '@iconify/react';
import { Card } from '../components';
import { getColorByScheme, getTextColorForBackground } from '../utils/colors';
import { useSettings } from '../context/SettingsContext';

export default function Changelog({ onBack, colorIndex }) {
  const { settings } = useSettings();
  const [releases, setReleases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const backgroundColor = getColorByScheme(colorIndex, settings.visual.colorScheme);
  const textColor = getTextColorForBackground(backgroundColor);

  // Fetch releases from GitHub API
  useEffect(() => {
    const fetchReleases = async () => {
      try {
        setLoading(true);
        // Fetch releases from GitHub API
        const response = await fetch(
          'https://api.github.com/repos/gageminamoto/yahtzee-score-card/releases'
        );
        
        if (!response.ok) {
          throw new Error('Failed to fetch releases');
        }
        
        const data = await response.json();
        setReleases(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching releases:', err);
        setError('Failed to load changelog. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchReleases();
  }, []);

  // Format date to readable string
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // Parse markdown-like release notes into HTML
  // Simple parser for common markdown patterns
  const parseReleaseNotes = (body) => {
    if (!body) return '';
    
    const lines = body.split('\n');
    const processed = [];
    let inList = false;
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const trimmed = line.trim();
      const isListItem = trimmed.startsWith('- ') || trimmed.startsWith('* ');
      
      // If we encounter a list item
      if (isListItem) {
        // Start a list if we're not already in one
        if (!inList) {
          processed.push('<ul class="list-disc ml-6 mb-4 space-y-1">');
          inList = true;
        }
        // Process the list item content
        let content = trimmed.substring(2);
        // Handle bold text
        if (content.includes('**')) {
          content = content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        }
        // Handle links
        if (content.includes('[') && content.includes('](')) {
          content = content.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="underline hover:opacity-70" style="color: inherit;">$1</a>');
        }
        processed.push(`<li>${content}</li>`);
      } else {
        // If we were in a list, close it
        if (inList) {
          processed.push('</ul>');
          inList = false;
        }
        
        // Process non-list lines
        // Headers (## or ###)
        if (trimmed.startsWith('### ')) {
          processed.push(`<h3 class="font-serif text-subtitle text-white dark:text-black mb-2 mt-4">${trimmed.replace('### ', '')}</h3>`);
        } else if (trimmed.startsWith('## ')) {
          processed.push(`<h2 class="font-serif text-title text-white dark:text-black mb-3 mt-6">${trimmed.replace('## ', '')}</h2>`);
        } else if (trimmed === '') {
          // Empty lines
          processed.push('<br />');
        } else {
          // Regular paragraphs
          let content = line;
          // Handle bold text
          if (content.includes('**')) {
            content = content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
          }
          // Handle links
          if (content.includes('[') && content.includes('](')) {
            content = content.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="underline hover:opacity-70" style="color: inherit;">$1</a>');
          }
          processed.push(`<p class="mb-2">${content}</p>`);
        }
      }
    }
    
    // Close any open list
    if (inList) {
      processed.push('</ul>');
    }
    
    return processed.join('');
  };

  return (
    <div
      className="min-h-dvh p-4 md:p-8 transition-colors duration-500"
      style={{ backgroundColor }}
    >
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={onBack}
            className="font-sans text-body hover:opacity-70 transition-opacity flex items-center gap-2"
            style={{ color: textColor }}
          >
            <Icon icon="basil:arrow-left-solid" className="w-6 h-6" />
            Back
          </button>
          <h1
            className="font-serif text-subtitle md:text-title text-balance"
            style={{ color: textColor }}
          >
            CHANGELOG
          </h1>
          <div className="w-20" /> {/* Spacer for centering */}
        </div>

        {/* Loading State */}
        {loading && (
          <Card padding="medium">
            <div className="text-center py-8">
              <p
                className="font-sans text-body text-white dark:text-black"
                style={{ color: textColor }}
              >
                Loading changelog...
              </p>
            </div>
          </Card>
        )}

        {/* Error State */}
        {error && !loading && (
          <Card padding="medium">
            <div className="text-center py-8">
              <p
                className="font-sans text-body text-white dark:text-black mb-4"
                style={{ color: textColor }}
              >
                {error}
              </p>
              <a
                href="https://github.com/gageminamoto/yahtzee-score-card/releases"
                target="_blank"
                rel="noopener noreferrer"
                className="font-sans text-body underline hover:opacity-70 transition-opacity inline-block"
                style={{ color: textColor }}
              >
                View on GitHub
              </a>
            </div>
          </Card>
        )}

        {/* Releases List */}
        {!loading && !error && (
          <div className="space-y-6">
            {releases.length === 0 ? (
              <Card padding="medium">
                <div className="text-center py-8">
                  <p
                    className="font-sans text-body text-white dark:text-black mb-4"
                    style={{ color: textColor }}
                  >
                    No releases yet. Check back soon!
                  </p>
                  <a
                    href="https://github.com/gageminamoto/yahtzee-score-card"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-sans text-body underline hover:opacity-70 transition-opacity inline-block"
                    style={{ color: textColor }}
                  >
                    View on GitHub
                  </a>
                </div>
              </Card>
            ) : (
              releases.map((release) => (
                <Card key={release.id} padding="medium">
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
                      <h2
                        className="font-serif text-title text-white dark:text-black"
                        style={{ color: textColor }}
                      >
                        {release.name || release.tag_name}
                      </h2>
                      {release.prerelease && (
                        <span
                          className="font-sans text-ui px-3 py-1 bg-white/20 dark:bg-black/20 text-white dark:text-black rounded"
                          style={{ color: textColor }}
                        >
                          Pre-release
                        </span>
                      )}
                    </div>
                    <p
                      className="font-sans text-ui opacity-70"
                      style={{ color: textColor }}
                    >
                      {formatDate(release.published_at)}
                    </p>
                  </div>
                  
                  {/* Release Notes */}
                  {release.body && (
                    <div
                      className="font-sans text-body text-white dark:text-black"
                      style={{ color: textColor }}
                      dangerouslySetInnerHTML={{
                        __html: parseReleaseNotes(release.body),
                      }}
                    />
                  )}

                  {/* GitHub Link */}
                  <div className="mt-4 pt-4 border-t border-white/20 dark:border-black/20">
                    <a
                      href={release.html_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-sans text-body underline hover:opacity-70 transition-opacity inline-flex items-center gap-2"
                      style={{ color: textColor }}
                    >
                      View on GitHub
                      <Icon icon="basil:arrow-right-solid" className="w-4 h-4" />
                    </a>
                  </div>
                </Card>
              ))
            )}
          </div>
        )}

        {/* Footer Link */}
        {!loading && !error && releases.length > 0 && (
          <div className="mt-8 text-center">
            <a
              href="https://github.com/gageminamoto/yahtzee-score-card/releases"
              target="_blank"
              rel="noopener noreferrer"
              className="font-sans text-body underline hover:opacity-70 transition-opacity"
              style={{ color: textColor }}
            >
              View all releases on GitHub
            </a>
          </div>
        )}
      </div>
    </div>
  );
}

Changelog.propTypes = {
  onBack: PropTypes.func.isRequired,
  colorIndex: PropTypes.number.isRequired,
};
