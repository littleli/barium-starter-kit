import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import DevTools from 'mobx-react-devtools';

class AppState {
  @observable timer = 0;

  constructor() {
  }

  resetTimer() {
    this.timer = 0;
  }

  inc() {
    this.timer++;
  }
}

interface IAppProps {
  appState: AppState;
}

@observer
class TimerView extends React.Component<IAppProps, any> {
  render() {
    return (
      <div>
        <button onClick={this.onReset}>
          Seconds passed: {this.props.appState.timer}
        </button>
        <button onClick={this.inc}>
          +
        </button>
      </div>
    );
  }

  inc = () => {
    this.props.appState.inc();
  }

  onReset = () => {
    this.props.appState.resetTimer();
  }
};

const appState = new AppState();

setInterval(() => {
  appState.timer += 1;
}, 5000);

const main = () =>
  ReactDOM.render(<TimerView appState={appState} />, document.getElementById('app'));

main();
