import { sprinkles } from './sprinkles.css';
import * as styles from './App.css';

export const App = () => (
  <div
    className={sprinkles({
      background: {
        lightMode: 'green-500',
        darkMode: 'gray-900',
      },
      height: '100vh',
      width: '100vw',
      display: 'flex',
      placeItems: 'center',
      padding: '6x',
    })}
  >
    <div
      className={`${styles.card({
        bg: ['light', 'dark'],
        size: 'big',
      })} ${sprinkles({ borderRadius: '0x' })}`}
    >
      <div
        className={sprinkles({
          display: 'flex',
          alignItems: 'center',
          flexDirection: 'column',
          gap: {
            xs: '5x',
            sm: '6x',
          },
        })}
      >
        <h1
          className={sprinkles({
            fontFamily: 'body',
            textAlign: 'center',
            typeSize: {
              xs: '4x',
              sm: '4x',
              md: '5x',
            },
          })}
        >
          <span role="img" aria-label="Waving hand">
            👋
          </span>
          <span role="img" aria-label="vanilla-extract logo">
            🧁
          </span>
          <span role="img" aria-label="Sprinkles logo">
            🍨
          </span>
        </h1>
        <h2
          className={`${styles.text({
            variant: 'heading',
            size: 'xxl',
          })} ${sprinkles({
            fontFamily: 'body',
            textAlign: 'center',
          })}`}
        >
          Hello from vanilla-extract and Sprinkles
        </h2>
      </div>
    </div>
  </div>
);
