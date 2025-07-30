# Birlik Live API Analysis

## Overview
Birlik Live is a comprehensive multi-service platform with features for maps, marketplace, social networks, and more. The platform is accessible at https://birlik-live.onrender.com/ and provides various API endpoints for integration.

## API Structure
Based on the existing integration code, the Birlik Live API provides the following endpoints:

### User Management
- `GET /users/{user_id}` - Get user information
- `POST /users` - Create a new user
- `PUT /users/{user_id}` - Update user information

### Identity Verification
- `POST /identity/verify/{user_id}` - Verify a user's identity
- `GET /identity/status/{user_id}` - Get the status of a user's identity verification

### Transactions
- `POST /transactions` - Create a new transaction
- `GET /transactions/{transaction_id}` - Get transaction information
- `GET /users/{user_id}/transactions` - Get a user's transactions

### Wallet Management
- `GET /wallets/{user_id}/balance` - Get a user's wallet balance
- `POST /wallets/{user_id}` - Create a new wallet for a user

### NFT Passports
- `POST /nft-passports/{user_id}` - Create a new NFT passport for a user
- `GET /nft-passports/{user_id}` - Get a user's NFT passport
- `POST /nft-passports/verify/{passport_id}` - Verify an NFT passport

### Webhooks
The API provides webhooks for the following events:
- `transfer.created` - When a transfer is created
- `transfer.completed` - When a transfer is completed
- `transfer.failed` - When a transfer fails
- `passport.created` - When an NFT passport is created
- `passport.verified` - When an NFT passport is verified
- `passport.revoked` - When an NFT passport is revoked

## Authentication
The API uses JWT-based authentication with API key and secret. The authentication flow is as follows:
1. Register a user with the API
2. Generate an authentication token using the API key and secret
3. Include the token in the Authorization header for subsequent requests

## Data Storage
The platform uses Web3.Storage for decentralized document storage. The storage integration provides the following features:
- Upload files to IPFS
- Upload directories to IPFS
- Upload JSON data to IPFS
- Get the status of a file in IPFS
- List uploads in IPFS
- Get IPFS URLs for files
- Get HTTP gateway URLs for files

## Frontend Integration
The frontend integration provides services for:
- User registration and login
- NFT passport creation and retrieval
- Web3 wallet connection
- Document upload to IPFS
- Cross-border transfers
- Transaction history retrieval
- Wallet balance retrieval

## Configuration Requirements
To integrate with the Birlik Live API, the following configuration settings are required:
- `BIRLIK_LIVE_API_KEY` - API key for authentication
- `BIRLIK_LIVE_API_SECRET` - API secret for authentication
- `BIRLIK_LIVE_BASE_URL` - Base URL for the API (https://birlik-live.onrender.com/api)
- `WEB3_STORAGE_API_KEY` - API key for Web3.Storage
- `IPFS_GATEWAY` - IPFS gateway URL (https://ipfs.io/ipfs)

## Integration Status
The Цифровой Банк already has comprehensive integration code for Birlik Live, including:
- Backend API client
- Authentication utilities
- Webhook handlers
- Storage integration
- Frontend integration service

The integration supports all the key features of the Birlik Live platform, including user management, identity verification, transactions, wallet management, and NFT passports.
