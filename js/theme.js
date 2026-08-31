document.addEventListener("DOMContentLoaded", () => {
    const themeSelector = document.getElementById('theme-selector');
    const defaultTheme = 'forest-harmony'; // Define the default theme
  
    // Function to fetch and parse the CSS file
    async function loadCSSThemes(cssPath) {
      try {
        console.log(`Fetching CSS themes from ${cssPath}...`);
        const response = await fetch(cssPath);
        const cssText = await response.text();
        console.log('CSS themes fetched successfully.');
        parseAndPopulateThemes(cssText);
      } catch (error) {
        console.error(`Error fetching CSS file: ${error.message}`);
      }
    }
  
    // Function to parse CSS text and populate theme selector
    function parseAndPopulateThemes(cssText) {
      const themeRegex = /\.theme-([a-z-]+) {([\s\S]+?)}/g;
      let match;
  
      console.log('Parsing CSS themes...');
      while ((match = themeRegex.exec(cssText)) !== null) {
        const themeName = match[1].replace(/-/g, ' ');
        const themeClass = match[1];
        const option = document.createElement('option');
        option.value = `theme-${themeClass}`;
        option.textContent = capitalizeWords(themeName);
        themeSelector.appendChild(option);
        console.log(`Added theme: ${themeName}`);
      }
      console.log('CSS themes parsed successfully.');
    }
  
    // Function to capitalize the first letter of each word
    function capitalizeWords(str) {
      return str.replace(/\b\w/g, char => char.toUpperCase());
    }
  
    // Function to change theme
    function changeTheme(theme) {
      document.body.className = theme;
      console.log(`Theme changed to: ${theme}`);
    }
  
    // Initialize with the default theme or previously selected theme
    const savedTheme = localStorage.getItem('selectedTheme') || defaultTheme;
    themeSelector.value = savedTheme;
    changeTheme(savedTheme);
  
    // Event listener for theme change
    themeSelector.addEventListener('change', (event) => {
      const selectedTheme = event.target.value;
      localStorage.setItem('selectedTheme', selectedTheme);
      changeTheme(selectedTheme);
    });
  
    // Load themes from CSS file
    loadCSSThemes('css/pallete.css');
  });
  
