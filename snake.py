#!/usr/bin/env python3
import curses
import random
import time

def main(stdscr):
    # Initialize curses
    curses.curs_set(0)  # Hide cursor
    curses.start_color()
    curses.init_pair(1, curses.COLOR_GREEN, curses.COLOR_BLACK)  # Snake color
    curses.init_pair(2, curses.COLOR_RED, curses.COLOR_BLACK)    # Food color
    curses.init_pair(3, curses.COLOR_YELLOW, curses.COLOR_BLACK) # Score color
    
    # Set up screen dimensions
    height, width = stdscr.getmaxyx()
    
    # Check if terminal is big enough
    if height < 10 or width < 20:
        stdscr.clear()
        stdscr.addstr(0, 0, "Terminal too small! Resize and try again.")
        stdscr.refresh()
        time.sleep(2)
        return
        
    # Game boundaries
    game_win = curses.newwin(height-2, width-2, 1, 1)
    game_win.keypad(1)
    game_win.timeout(100)  # Refresh rate (milliseconds)
    
    # Initial snake position
    snake_x = width // 4
    snake_y = height // 2
    snake = [
        [snake_y, snake_x],
        [snake_y, snake_x-1],
        [snake_y, snake_x-2]
    ]
    
    # Initial food position
    food = [height // 2, width // 2]
    game_win.addch(food[0], food[1], curses.ACS_DIAMOND, curses.color_pair(2))
    
    # Initial direction (RIGHT)
    key = curses.KEY_RIGHT
    
    # Initial score
    score = 0
    
    # Game loop
    while True:
        # Get window dimensions (in case of resize)
        height, width = stdscr.getmaxyx()
        game_height, game_width = height-2, width-2
        
        # Check for terminal size
        if height < 10 or width < 20:
            stdscr.clear()
            stdscr.addstr(0, 0, "Terminal too small! Resize and try again.")
            stdscr.refresh()
            time.sleep(0.5)
            continue
            
        # Display border and score
        stdscr.clear()
        stdscr.border(0)
        stdscr.addstr(0, 2, f" SNAKE GAME ", curses.color_pair(1) | curses.A_BOLD)
        stdscr.addstr(0, width-15, f" Score: {score} ", curses.color_pair(3) | curses.A_BOLD)
        stdscr.refresh()
        
        # Get next key press, but don't wait
        next_key = game_win.getch()
        
        # If key pressed, change direction
        if next_key != -1:
            key = next_key
            
        # Quit game if 'q' is pressed
        if key == ord('q'):
            break
            
        # Calculate new head position based on direction
        new_head = [snake[0][0], snake[0][1]]
        
        if key == curses.KEY_DOWN:
            new_head[0] += 1
        elif key == curses.KEY_UP:
            new_head[0] -= 1
        elif key == curses.KEY_LEFT:
            new_head[1] -= 1
        elif key == curses.KEY_RIGHT:
            new_head[1] += 1
            
        # Insert new head
        snake.insert(0, new_head)
        
        # Check for wall collision
        if (
            new_head[0] <= 0 or 
            new_head[0] >= game_height-1 or 
            new_head[1] <= 0 or 
            new_head[1] >= game_width-1
        ):
            game_over(stdscr, score)
            break
            
        # Check for self collision
        if new_head in snake[1:]:
            game_over(stdscr, score)
            break
            
        # Check if snake eats the food
        if snake[0] == food:
            # Create new food
            while True:
                food = [
                    random.randint(1, game_height-2),
                    random.randint(1, game_width-2)
                ]
                # Make sure new food is not on snake
                if food not in snake:
                    break
            
            # Increase score
            score += 10
        else:
            # Remove tail if no food eaten
            tail = snake.pop()
            game_win.addch(tail[0], tail[1], ' ')
            
        try:
            # Draw food
            game_win.addch(food[0], food[1], curses.ACS_DIAMOND, curses.color_pair(2))
            
            # Draw snake head
            game_win.addch(snake[0][0], snake[0][1], curses.ACS_CKBOARD, curses.color_pair(1))
            
            # Draw rest of the snake
            for i in range(1, len(snake)):
                game_win.addch(snake[i][0], snake[i][1], curses.ACS_CKBOARD, curses.color_pair(1))
        except curses.error:
            # Ignore errors from drawing near edges
            pass
            
def game_over(stdscr, score):
    # Game over screen
    stdscr.clear()
    height, width = stdscr.getmaxyx()
    
    # Display game over message
    game_over_msg = "GAME OVER!"
    score_msg = f"Your score: {score}"
    exit_msg = "Press any key to exit..."
    
    # Calculate center positions
    y_center = height // 2
    x_center_game_over = (width - len(game_over_msg)) // 2
    x_center_score = (width - len(score_msg)) // 2
    x_center_exit = (width - len(exit_msg)) // 2
    
    # Display messages
    stdscr.addstr(y_center - 2, x_center_game_over, game_over_msg, curses.A_BOLD)
    stdscr.addstr(y_center, x_center_score, score_msg)
    stdscr.addstr(y_center + 2, x_center_exit, exit_msg)
    
    stdscr.refresh()
    stdscr.getch()  # Wait for keypress

if __name__ == "__main__":
    # Initialize curses wrapper
    curses.wrapper(main)

