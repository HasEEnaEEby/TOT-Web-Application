export const getPasswordStrength = (password: string) => {
    if (!password) {
      return {
        score: 0,
        label: '',
        color: '',
        textColor: '',
      };
    }
  
    let score = 0;
    
    // Length check
    if (password.length >= 8) score++;
    if (password.length >= 12) score++;
    
    // Character variety checks
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
  
    const strengthMap = {
      0: {
        label: 'Very Weak',
        color: 'bg-red-500',
        textColor: 'text-red-500',
      },
      1: {
        label: 'Weak',
        color: 'bg-orange-500',
        textColor: 'text-orange-500',
      },
      2: {
        label: 'Fair',
        color: 'bg-yellow-500',
        textColor: 'text-yellow-600',
      },
      3: {
        label: 'Good',
        color: 'bg-green-500',
        textColor: 'text-green-500',
      },
      4: {
        label: 'Strong',
        color: 'bg-green-600',
        textColor: 'text-green-600',
      },
    };
  
    return {
      score: Math.min(score, 4),
      ...strengthMap[Math.min(score, 4) as keyof typeof strengthMap],
    };
  };