# 🚨 Installation Required

## Error
```
Module not found: Can't resolve 'pusher-js'
Module not found: Can't resolve 'pusher'
```

## Solution

You need to install the Pusher dependencies. Run this command in your terminal:

### Using npm:
```bash
npm install pusher pusher-js date-fns
```

### Or using pnpm:
```bash
pnpm add pusher pusher-js date-fns
```

### Or using yarn:
```bash
yarn add pusher pusher-js date-fns
```

---

## What These Packages Do

| Package | Purpose |
|---------|---------|
| `pusher` | Server-side Pusher SDK for sending real-time events |
| `pusher-js` | Client-side Pusher SDK for receiving real-time events |
| `date-fns` | Date formatting utilities (used in chat UI) |

---

## After Installation

1. **Set up Pusher Account**:
   - Go to [pusher.com](https://pusher.com)
   - Sign up for free account
   - Create a new Channels app
   - Copy your credentials

2. **Add to `.env.local`**:
   ```env
   # Pusher Server Credentials
   PUSHER_APP_ID=your_app_id
   PUSHER_KEY=your_key
   PUSHER_SECRET=your_secret
   PUSHER_CLUSTER=your_cluster
   
   # Pusher Client Credentials (for browser)
   NEXT_PUBLIC_PUSHER_KEY=your_key
   NEXT_PUBLIC_PUSHER_CLUSTER=your_cluster
   ```

3. **Restart Dev Server**:
   ```bash
   npm run dev
   ```

4. **Test the Feature**:
   - Visit `/groups`
   - Create a group
   - Start chatting!

---

## PowerShell Execution Policy Issue

If you're seeing PowerShell execution policy errors, you have two options:

### Option 1: Use CMD instead of PowerShell
Open Command Prompt (cmd.exe) and run:
```cmd
npm install pusher pusher-js date-fns
```

### Option 2: Enable PowerShell scripts (Admin required)
Run PowerShell as Administrator and execute:
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

Then run the npm install command again.

---

## Verification

After installation, check that packages are installed:

```bash
npm list pusher pusher-js date-fns
```

You should see:
```
├── pusher@5.x.x
├── pusher-js@8.x.x
└── date-fns@4.x.x
```

---

## Next Steps

1. ✅ Install dependencies (run command above)
2. ✅ Sign up for Pusher account
3. ✅ Add credentials to `.env.local`
4. ✅ Restart dev server
5. ✅ Test group chat feature

---

**Run this command now:**
```bash
npm install pusher pusher-js date-fns
```
