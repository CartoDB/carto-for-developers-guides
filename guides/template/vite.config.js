import basicSsl from '@vitejs/plugin-basic-ssl'
import eslint from 'vite-plugin-eslint';

export default {
 plugins: [basicSsl(), eslint()]
}
