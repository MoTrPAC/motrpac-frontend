import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import PageTitle from '../lib/ui/pageTitle';

/**
 * Renders the MCP Server page.
 *
 * @param {Object} profile    Redux state of authenticated user profile
 *
 * @returns {object} JSX representation of the Methods component
 */
export function MCPServer({ profile = {} }) {
  const [mcpToken, setMcpToken] = useState(null);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    if (isGenerating) return;
    if (!profile.user_metadata) return;

    const { email, name } = profile.user_metadata;
    if (!email || !name) {
      setError('User profile is missing required information. Please ensure your account has a valid email and name.');
      return;
    }

    const host = import.meta.env.VITE_ES_PROXY_HOST;
    const accessToken = import.meta.env.VITE_ES_ACCESS_TOKEN;

    setError(null);
    setIsGenerating(true);

    try {
      const response = await fetch(`${host}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ username: email, email, name }),
      });

      if (response.ok) {
        const data = await response.json();
        setMcpToken(data.access_token);
        setCopied(false);
      } else {
        setError('Failed to generate MCP token. Please try again later.');
      }
    } catch {
      setError('Network error. Please check your connection and try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(mcpToken)
      .then(() => {
        setCopied(true);
        setError(null);
      })
      .catch(() => {
        setError('Failed to copy token. Please copy it manually.');
      });
  };

  return (
    <div className="mcpServerPage px-3 px-md-4 mb-3 container">
      <Helmet>
        <html lang="en" />
        <title>MCP Server - MoTrPAC Data Hub</title>
      </Helmet>
      <PageTitle title="MCP Server" />
      <div className="mcp-server-content-container">
        <div className="mcp-server-summary-container row mb-4">
          <div className="lead col-12">
            Model Context Protocol (MCP) server enables MoTrPAC to make the
            multi-omic, multi-tissue, multi-species datasets directly queryable
            by LLM-powered assistants. The available MCP toolset makes data
            exploration across common query types (genes, proteins, metabolites,
            and phenotype/sample metadata) much faster through LLM-powered clients
            including Claude Desktop, Claude Code, and GitHub Copilot in VS Code.
            The MCP server is currently in the early stages of development, and we
            welcome any feedback or suggestions from our users.
          </div>
          <h2 className="col-12 mt-4">Access Token</h2>
          <p className="col-12 mt-3">
            To access the MCP server, you will need to generate an access token.
            If you have an account on the MoTrPAC Data Hub, you can login and
            generate a token on this page by clicking the &quot;Generate Access Token&quot;
            button below. If you do not have an account, you can create one by
            {' '}
            <Link to="/data-access">signing up</Link>
            {' '}
            on the MoTrPAC Data Hub. Once you have generated your access token,
            you can use it in the client configuration as shown below. The generated
            token will expire in 3 months and a new one will need to be generated.
            Please keep your access token secure and do not share it with others,
            as it provides access to your account and the associated data. 
          </p>
          {profile && profile.user_metadata && (
            <div className="mcp-server-token-container col-12 row mt-3 mb-4">
              <button className="btn btn-primary btn mx-auto" onClick={handleGenerate} disabled={isGenerating}>
                Generate MCP Access Token
              </button>
              {error && (
                <div className="col-12 mt-3">
                  <div className="alert alert-danger mb-0" role="alert">
                    {error}
                  </div>
                </div>
              )}
              {mcpToken && (
                <div className="row">
                  <div className="mt-3 mb-3 p-3 border rounded">
                    <code style={{ wordBreak: "break-all" }}>{mcpToken}</code>
                  </div>
                  <button className="btn btn-dark mx-auto" onClick={handleCopy}>{copied ? "Copied!" : "Copy"}</button>
                </div>
              )}
            </div>
          )}
          <h2 className="col-12 mt-4">Client Configuration</h2>
          <h4 className="col-12 mt-3">
            Claude Desktop:
          </h4>
          <div className="col-12 m-3 p-3 bg-light rounded">
            <pre className="text-muted">{'// claude_desktop_config.json'}</pre>
            <pre>
              {JSON.stringify({
                mcpServers: {
                  "motrpac-search": {
                    command: "npx",
                    args: [
                      "-y",
                      "mcp-remote",
                      "https://motrpac-data.org/mcp/",
                      "--header",
                      "Authorization: Bearer <YOUR_ACCESS_TOKEN>"
                    ]
                  }
                }
              }, null, 2)}
            </pre>
          </div>
          <h4 className="col-12 mt-3">
            Claude Code:
          </h4>
          <div className="col-12 m-3 p-3 bg-light rounded">
            <pre className="text-muted">{'// Run the following command line and then `claude mcp list` to verify'}</pre>
            <pre>
              {[
                'claude mcp add motrpac-search \\',
                '  --scope user \\',
                '  -- npx -y mcp-remote https://motrpac-data.org/mcp/ \\',
                '  --header "Authorization: Bearer <YOUR_TOKEN>"',
              ].join('\n')}
            </pre>
          </div>
          <h4 className="col-12 mt-3">
            GitHub Copilot in VS Code:
          </h4>
          <div className="col-12 m-3 p-3 bg-light rounded">
            <pre className="text-muted">{'// ../Code/User/mcp.json'}</pre>
            <pre>
              {JSON.stringify({
                servers: {
                  "motrpac-search": {
                    type: "http",
                    url: "https://motrpac-data.org/mcp/",
                    headers: {
                      Authorization: "Bearer <YOUR_ACCESS_TOKEN>"
                    }
                  }
                }
              }, null, 2)}
            </pre>
          </div>
          <h2 className="col-12 mt-4">Example Prompts</h2>
          <div className="col-12 m-3 p-3 bg-light rounded">
            <code className="text-dark">
              Give me an overview and key findings of the summary-level results
              for BAG3 gene in the muscle tissue in MoTrPAC&apos;s human sedentary
              adults acute exercise study.
            </code>
          </div>
          <div className="col-12 m-3 p-3 bg-light rounded">
            <code className="text-dark">
              Summarize the log2 fold changes for the TFEB gene pertinent to the
              adipose tissue in males in the MoTrPAC rats study and the human
              sedentary adults study by timepoints, with a focus on RNA-seq and
              phosphoproteomics. Combined-sex results in human is acceptable.
            </code>
          </div>
        </div>
      </div>
    </div>
  );
}

MCPServer.propTypes = {
  profile: PropTypes.shape({
    user_metadata: PropTypes.object,
  }),
};

const mapStateToProps = (state) => ({
  profile: state.auth.profile,
});

export default connect(mapStateToProps)(MCPServer);
