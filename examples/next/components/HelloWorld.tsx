import { divider } from './divider.css';
import * as styles from './HelloWorld.css';
import { sprinkles } from './sprinkles.css';

export const classNames = (
  ...classes: Array<string | boolean | null | undefined>
) => classes.filter(Boolean).join(' ');

export function HelloWorld() {
  return (
    <div
      className={classNames(styles.root, sprinkles({ background: 'grey500' }))}
    >
      <h1 className={styles.title}>🧁 Hello from vanilla-extract!</h1>
      <button
        className={styles.button({
          iconOnly: false,
          link: true,
          variant: 'linkInverted',
          size: 'md',
        })}
      >
        Button
      </button>
      <div className={divider} />
    </div>
  );
}
