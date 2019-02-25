import React from 'react';
import { StyleSheet, Alert } from 'react-native';
import { WebView } from 'react-native-webview';
import { withComlinkExpose } from 'react-native-webview-comlink';

export default class App extends React.Component {
  constructor(props) {
    super(props);

    const rootObj = {
      alert: (title, message, onYes, onNo) => {
        Alert.alert(title, message, [{
          text: 'YES',
          onPress: onYes,
        }, {
          text: 'NO',
          onPress: onNo,
        }]);
      },
    };

    this.WebViewComponent = withComlinkExpose(rootObj, { forwardRef: true })(WebView);

    this.ref = React.createRef();
  }

  render() {
    const uri = 'http://localhost:3000';
    // localhost works for ios simulator, for other case please use host address
    // const uri = 'http://<you host ip address>:3000';
    return (
      <this.WebViewComponent
        style={styles.container}
        source={{ uri }}
        ref={this.ref}
        >
      </this.WebViewComponent>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
