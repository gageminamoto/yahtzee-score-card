import { Component } from 'react';
import PropTypes from 'prop-types';
import { Button } from './index';

/**
 * Error boundary that catches crashes in the multiplayer session layer.
 * Renders a recovery UI instead of crashing the entire app.
 */
export default class SessionErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  handleReset = () => {
    this.setState({ hasError: false });
    if (this.props.onReset) this.props.onReset();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-dvh flex flex-col items-center justify-center p-8 bg-neutral-900 text-white">
          <h1 className="font-serif text-title mb-4">Something went wrong</h1>
          <p className="font-sans text-body opacity-80 mb-8 text-center max-w-md">
            The multiplayer session encountered an unexpected error. Your game data is safe in Firebase.
          </p>
          <Button variant="solid" size="large" onClick={this.handleReset}>
            Return Home
          </Button>
        </div>
      );
    }

    return this.props.children;
  }
}

SessionErrorBoundary.propTypes = {
  children: PropTypes.node.isRequired,
  onReset: PropTypes.func,
};
