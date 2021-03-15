import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';

test('Login button disappears', () => {
  const result = render(<App />);

  const loginButtonElement = screen.getByText('Login');
  expect(loginButtonElement).toBeInTheDocument();

  const loginTextElement = screen.getByPlaceholderText('Username');
  fireEvent.change(loginTextElement, { target: { value: 'test' } });

  fireEvent.click(loginButtonElement);

  expect(loginButtonElement).not.toBeInTheDocument();
});

test('LeaderBoard appears and disappears on button click', () => {
  const result = render(<App />);

  const showLeaderBoardElement = screen.getByText('Show Leaderboard');
  expect(showLeaderBoardElement).toBeInTheDocument();

  fireEvent.click(showLeaderBoardElement);

  const tableElement = screen.getByText('Score');
  expect(showLeaderBoardElement).toBeInTheDocument();
  expect(tableElement).toBeInTheDocument();

  fireEvent.click(showLeaderBoardElement);
  expect(showLeaderBoardElement).toBeInTheDocument();
  expect(tableElement).not.toBeInTheDocument();
});

test('Board Renders', () => {
  const result = render(<App />);

  const loginButtonElement = screen.getByText('Login');
  expect(loginButtonElement).toBeInTheDocument();

  const loginTextElement = screen.getByPlaceholderText('Username');
  fireEvent.change(loginTextElement, { target: { value: 'test' } });

  fireEvent.click(loginButtonElement);

  const boardElement = screen.queryByTestId('tic-tac-toe-board');
  expect(boardElement).toBeInTheDocument();
});
