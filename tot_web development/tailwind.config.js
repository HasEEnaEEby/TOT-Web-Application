module.exports = {
  darkMode: 'class',
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#FF5733', 
        secondary: '#C70039', 
        neutral: '#FFFFFF',  
        background: '#F4F4F4', 
        accent: '#FF6F61',    
        success: '#28A745',   
        error: '#DC3545',     
        info: '#17A2B8',     
      },
      fontFamily: {
        sans: ['Poppins', 'Arial', 'sans-serif'], 
        serif: ['Georgia', 'serif'], 
      },
      spacing: {
        '18': '4.5rem', 
      },
      borderRadius: {
        'xl': '1rem', 
      },
      boxShadow: {
        'custom': '0 4px 10px rgba(0, 0, 0, 0.1)', 
      },
      backgroundImage: {
        'text-gradient': 'linear-gradient(to right, #FF5733, #C70039, #FF6F61)',
      },
    },
  },
  plugins: [],
};
