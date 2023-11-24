import { useEffect } from 'react';
import { Grid, Button } from 'semantic-ui-react';
import Key from './Key';
import routes from '../data/routes.json';

import './Keyboard.scss';

const Keyboard = (props) => {
  const {
    noService, isDarkMode,
    onChar, onDelete, onEnter,
    correctRoutes, similarRoutes, presentRoutes, absentRoutes
  } = props;

  useEffect(() => {
    const listener = (e) => {
      if (e.code === 'Enter') {
        onEnter();
      } else if (e.code === 'Backspace') {
        onDelete();
      } else {
        const key = e.key.toUpperCase()
        if (key === 'G' || key === 'C') {
          onChar('GLC');
        } else if (key === 'B') {
          onChar('BL');
        } else if (key === 'R') {
          onChar('RL');
        } else if (key === 'O') {
          onChar('OL');
        } else if (key === 'E') {
          onChar('GLE');
        } else if (key === 'B') {
          onChar('GLB');
        } else if (key === 'D') {
          onChar('GLD');
        }
      }
    }
    window.addEventListener('keyup', listener)
    return () => {
      window.removeEventListener('keyup', listener)
    }
  }, [onEnter, onDelete, onChar])

  const handleDelete = () => {
    onDelete();
  }

  const handleEnter = () => {
    onEnter();
  }


  return (
    <Grid centered columns={7} className='keyboard'>
      <Grid.Row>
        {
          ["RL", "GLC", "GLB", "GLD", "GLE", "BL", "OL"].map((routeId) => {
            return (
              <Key
                id={routeId}
                key={routeId}
                isDarkMode={isDarkMode}
                onClick={onChar}
                disabled={noService.includes(routeId)}
                isCorrect={correctRoutes.includes(routeId)}
                isSimilar={similarRoutes.includes(routeId)}
                isPresent={presentRoutes.includes(routeId)}
                isAbsent={absentRoutes.includes(routeId)}
              />
            )
          })
        }
      </Grid.Row>
        <Grid.Row columns={6}>
          <Grid.Column className='key' stretched>
            <Button onClick={handleEnter} inverted={isDarkMode}>
              Enter
            </Button>
          </Grid.Column>
          <Grid.Column className='key' stretched>
            <Button onClick={handleDelete} inverted={isDarkMode}>
              Delete
            </Button>
          </Grid.Column>
      </Grid.Row>
    </Grid>
  );
}

export default Keyboard;
