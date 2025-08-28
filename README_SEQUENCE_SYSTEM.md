# User Sequence ID System

## Overview
This system generates unique, sequential IDs for user registration in the format `ro00001`, `ro00002`, etc.

## Implementation Details

### Firestore Structure
```
/sequences/user_sequence
{
  currentSequence: number,
  updatedAt: timestamp
}
```

### How It Works

1. **Atomic Transaction**: Uses Firestore transactions to ensure no duplicate sequence numbers
2. **Auto-increment**: Each new user gets the next available sequence number
3. **Format**: `ro` prefix + 5-digit zero-padded number (e.g., `ro00001`)
4. **Fallback**: If transaction fails, generates timestamp-based ID

### Code Location
- **Service**: `src/app/auth/services/login.service.ts`
- **Interface**: `src/app/auth/models/sequence.model.ts`

### Usage
The sequence ID is automatically generated during user registration and stored as the `readableId` field in the user document.

### Example Sequence
- 1st user: `ro00001`
- 2nd user: `ro00002`
- 100th user: `ro00100`
- 99999th user: `ro99999`

### Benefits
- ✅ **Unique**: No duplicate IDs possible
- ✅ **Sequential**: Easy to track user registration order
- ✅ **Readable**: Human-friendly format
- ✅ **Scalable**: Supports up to 99,999 users
- ✅ **Atomic**: Thread-safe using Firestore transactions
