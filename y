{
  "rules": {
    ".read": "auth != null",
    ".write": "auth != null",
    
    "usuarios": {
      "$uid": {
        ".read": "$uid === auth.uid",
        ".write": "$uid === auth.uid"
      }
    }
  }
}
