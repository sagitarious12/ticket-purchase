import React from 'react';
import { RenderResult, render, screen } from '@testing-library/react';
import { App, AppProps } from './App';

function renderApp(props: Partial<AppProps> = {}): RenderResult {
  const defaultProps: AppProps = {

  }
  return render(<App {...defaultProps} {...props} />);
}

test('renders learn react link', async () => {
  const { findByTestId } = renderApp();
  const AppWrapper = await findByTestId('AppWrapper');
  expect(AppWrapper).toBeInTheDocument();
});
