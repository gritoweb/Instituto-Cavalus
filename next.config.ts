import path from 'path'
import { fileURLToPath } from 'url'

import { withPayload } from '@payloadcms/next/withPayload'

const dirname = path.dirname(fileURLToPath(import.meta.url))

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    localPatterns: [
      {
        pathname: '/api/media/file/**',
      },
    ],
  },
  // Packages with Cloudflare Workers (workerd) specific code
  // Read more: https://opennext.js.org/cloudflare/howtos/workerd
  serverExternalPackages: ['jose', 'pg-cloudflare'],

  // Your Next.js config here
  webpack: (webpackConfig: any, { isServer, webpack }: { isServer: boolean; webpack: any }) => {
    webpackConfig.resolve.extensionAlias = {
      '.cjs': ['.cts', '.cjs'],
      '.js': ['.ts', '.tsx', '.js', '.jsx'],
      '.mjs': ['.mts', '.mjs'],
    }

    // O importMap do admin importa estaticamente o R2ClientUploadHandler, que
    // só precisa de `getFileKey`. Porém o barrel
    // `@payloadcms/plugin-cloud-storage/utilities` também re-exporta
    // `resolveSignedURLKey` (server-only), que importa `payload/exports/internal`
    // e arrasta node:os, node:fs, undici, etc. para o bundle do navegador,
    // quebrando o webpack no scheme "node:". Como `resolveSignedURLKey` nunca
    // roda no client, trocamos apenas esse módulo por um stub no bundle client.
    if (!isServer) {
      webpackConfig.plugins.push(
        new webpack.NormalModuleReplacementPlugin(
          /plugin-cloud-storage[\\/]dist[\\/]utilities[\\/]resolveSignedURLKey\.js$/,
          path.resolve(dirname, 'src/stubs/resolveSignedURLKey.client.ts'),
        ),
      )
    }

    return webpackConfig
  },
}

export default withPayload(nextConfig, { devBundleServerPackages: false })
