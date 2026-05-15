import { Component, type ReactNode } from 'react';
import styles from './error-boundary.module.css';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  message: string;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, message: '' };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, message: error.message };
  }

  render() {
    if (this.state.hasError) {
      return (
        <main className={styles.errorBoundary}>
          <div className={styles.errorContainer}>
            <h1 className={styles.errorTitle}>Something went wrong</h1>
            <p className={styles.errorDetails}>{this.state.message || 'An unexpected error occurred.'}</p>
            <a href="/" style={{ color: 'var(--color-primary)', fontWeight: 600 }}>Go Home</a>
          </div>
        </main>
      );
    }
    return this.props.children;
  }
}
