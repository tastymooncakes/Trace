# Trace

A digital drawing application that creates verifiable provenance for your artwork. Built for artists who want to prove authenticity and track the creative evolution of their work.

## What is Trace?

Trace allows artists to:
- **Create** digital drawings with a simple canvas interface
- **Register** each iteration on the blockchain with C2PA content credentials
- **Prove** the creative process by linking source works to final pieces
- **Verify** authenticity through immutable blockchain records

Every drawing you register gets a unique identifier (NID) stored on the Numbers Protocol blockchain with IPFS backup, creating an unbreakable chain of provenance.

## How It Works

1. **Draw & Iterate**: Create your artwork, registering each version as you work
2. **Build Provenance**: Each registration is timestamped and stored with C2PA credentials
3. **Create Finals**: When ready, finalize your work - Trace automatically links all source iterations
4. **Prove Authenticity**: Share your work with verifiable blockchain records showing its entire creative journey

## Why Provenance Matters

In the age of AI-generated content, proving that you created your work is more important than ever. Trace uses:
- **C2PA (Coalition for Content Provenance and Authenticity)** - Industry standard for content credentials
- **Numbers Protocol** - Blockchain infrastructure for digital asset registration
- **IPFS** - Decentralized storage ensuring your work remains accessible

## Technology

Built with clean architecture principles:
- **Next.js 14** - React framework with server-side rendering
- **TypeScript** - Type-safe development
- **Numbers Protocol API** - Blockchain registration
- **C2PA** - Content credentials standard

## Getting Started

### Prerequisites
- Node.js 18+
- Numbers Protocol Capture Token ([Get one here](https://capture.numbersprotocol.io/))

### Installation
```bash
# Clone the repository
git clone https://github.com/yourusername/trace.git
cd trace

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Add your NUMBERS_CAPTURE_TOKEN to .env.local

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to start creating.

### Configuration

Create a `.env.local` file:
```
NUMBERS_CAPTURE_TOKEN=your_token_here
```

Get your Capture Token:
1. Create account at [capture.numbersprotocol.io](https://capture.numbersprotocol.io/)
2. Generate API token from dashboard
3. Fund account with NUM tokens (≈0.03 NUM per registration)

## Usage

1. **Select color and brush size** from the toolbar
2. **Draw** on the canvas
3. **Click "Save & Register"** to store the current iteration
4. **Repeat** to build up your creative process
5. **Draw your final version**
6. **Click "Finish & Create Final"** to register with full provenance

Your completed work will include references to all source iterations, creating a complete provenance chain.

## Cost

Registration costs on Numbers Protocol:
- **0.025 NUM** per registration
- **~0.004 NUM** gas per transaction
- **0.1 NUM/month** for permanent IPFS storage (optional)

Check current NUM price at [CoinGecko](https://www.coingecko.com/en/coins/numbers-protocol)

## Architecture

Trace follows clean architecture principles with clear separation of concerns:
```
domain/         - Core business entities and use cases
infrastructure/ - External APIs and services
hooks/          - React application logic
components/     - UI presentation layer
```

This structure makes the codebase:
- Easy to test
- Simple to maintain
- Straightforward to extend

## Learn More

- [Numbers Protocol Documentation](https://docs.numbersprotocol.io/)
- [C2PA Specification](https://c2pa.org/)
- [IPFS Documentation](https://docs.ipfs.tech/)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - see [LICENSE](LICENSE) file for details

## Support

For issues or questions:
- Open an issue on GitHub
- Check [Numbers Protocol Discord](https://discord.gg/numbersprotocol)

## Acknowledgments

Built with:
- [Numbers Protocol](https://numbersprotocol.io/) - Blockchain infrastructure
- [Next.js](https://nextjs.org/) - React framework
- [Zustand](https://github.com/pmndrs/zustand) - State management

---

**Trace** - Prove your creative journey
```

---

## .env.example
```
# Numbers Protocol API Configuration
# Get your token from: https://capture.numbersprotocol.io/
NUMBERS_CAPTURE_TOKEN=your_capture_token_here
```

---

## LICENSE
```
MIT License

Copyright (c) 2025 Ethan Wu

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.