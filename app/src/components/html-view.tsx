import { WebView } from 'react-native-webview';

export function HtmlView({ html }: { html: string }) {
  return <WebView originWhitelist={['*']} source={{ html }} style={{ flex: 1, backgroundColor: '#fff' }} />;
}
