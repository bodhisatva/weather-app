/* eslint-disable class-methods-use-this */

import React, { Component, ErrorInfo, ReactNode } from 'react'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  public static getDerivedStateFromError(): State {
    return { hasError: true }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo)
  }

  public render() {
    const { children } = this.props
    const { hasError } = this.state

    if (hasError) {
      return <h1>An error occured and something went wrong.</h1>
    }

    return children
  }
}

export default ErrorBoundary
