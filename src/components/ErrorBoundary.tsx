import React from 'react';

interface State { hasError: boolean; error: any; }

export class ErrorBoundary extends React.Component<{ children: React.ReactNode }, State> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error: any) {
    return { hasError: true, error };
  }
  componentDidCatch(error: any, info: any) {
    // Можно логировать ошибку
  }
  render() {
    if (this.state.hasError) {
      return <div className="p-8 text-red-600">Произошла ошибка: {String(this.state.error)}</div>;
    }
    return this.props.children;
  }
} 