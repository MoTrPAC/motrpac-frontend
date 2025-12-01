import React from 'react';
import PropTypes from 'prop-types';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism';

import '@styles/aiAssistant.scss';

/**
 * MessageList Component
 * Renders conversation messages with markdown support and syntax highlighting
 */

const Message = ({ message, isLoading = false }) => {
  const isUser = message.role === 'user';

  return (
    <div
      className={`message-item d-flex align-items-start mb-3 ${isUser ? 'flex-row-reverse user' : 'assistant'}`}
      role="article"
      aria-label={`${isUser ? 'User' : 'Assistant'} message`}
    >
      <div
        className={`message-icon rounded-circle p-2 border ${isUser ? 'border-primary ml-3' : 'border-dark mr-3'}`}
        aria-hidden="true"
      >
        <i className={`bi ${isUser ? 'bi-person-fill' : 'bi-robot'} text-${isUser ? 'primary' : 'secondary'}`}/>
      </div>
      <div className={`message-content-container p-3 ${isUser ? 'bg-primary text-white' : 'bg-light border'}`}>
        {message.content ? (
          isUser ? (
            // User messages: plain text with pre-wrap
            <div style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}>
              {message.content}
            </div>
          ) : (
            // Assistant messages: render as markdown
            <div className="markdown-content">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  // Custom code block renderer with syntax highlighting
                  code({ node: _node, inline, className, children, ...props }) {
                    const match = /language-(\w+)/.exec(className || '');
                    return !inline && match ? (
                      <SyntaxHighlighter
                        style={tomorrow}
                        language={match[1]}
                        PreTag="div"
                        {...props}
                      >
                        {String(children).replace(/\n$/, '')}
                      </SyntaxHighlighter>
                    ) : (
                      <code className={className} {...props}>
                        {children}
                      </code>
                    );
                  },
                  // Style links
                  a({ node: _node, children, ...props }) {
                    return (
                      <a
                        {...props}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary"
                      >
                        {children}
                      </a>
                    );
                  },
                }}
              >
                {message.content}
              </ReactMarkdown>
            </div>
          )
        ) : (
          // Show typing indicator for empty assistant messages
          !isUser &&
          isLoading && (
            <div
              className="assistant-typing-indicator"
              role="status"
              aria-live="polite"
              aria-label="Assistant is typing"
            >
              <span className="typing-dot"></span>
              <span className="typing-dot"></span>
              <span className="typing-dot"></span>
            </div>
          )
        )}
        {message.hasInternalKnowledge && (
          <small className="d-block mt-2 text-info">
            <i className="bi bi-lock-fill mr-1" aria-hidden="true" />
            Internal knowledge used
          </small>
        )}
      </div>
    </div>
  );
};

Message.propTypes = {
  message: PropTypes.shape({
    role: PropTypes.oneOf(['user', 'assistant']).isRequired,
    content: PropTypes.string.isRequired,
    timestamp: PropTypes.number,
    hasInternalKnowledge: PropTypes.bool,
  }).isRequired,
  isLoading: PropTypes.bool,
};

const MessageList = ({ messages, isLoading = false, messagesEndRef = null }) => {
  return (
    <div
      role="log"
      aria-live="polite"
      aria-label="Conversation messages"
      className="messages-list"
    >
      {messages.map((msg, idx) => (
        <Message
          key={msg.timestamp || idx}
          message={msg}
          isLoading={isLoading}
        />
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
};

MessageList.propTypes = {
  messages: PropTypes.arrayOf(
    PropTypes.shape({
      role: PropTypes.oneOf(['user', 'assistant']).isRequired,
      content: PropTypes.string.isRequired,
      timestamp: PropTypes.number,
      hasInternalKnowledge: PropTypes.bool,
    }),
  ).isRequired,
  isLoading: PropTypes.bool,
  messagesEndRef: PropTypes.object,
};

export default MessageList;
