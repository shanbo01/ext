// Select the input field and submit button
const input = document.querySelector('#input');
const submit = document.querySelector('#submit');

// Add event listener to submit button
submit.addEventListener('click', (event) => {
  event.preventDefault();

  // Get input value and trim whitespace
  const inputValue = input.value.trim();

  // Check if input is empty
  if (inputValue === '') {
    showError('Please enter a domain or IP address.');
    return;
  }

  // Remove http or https and www from input
  let strippedInput = inputValue.replace(/^https?:\/\//, '');
  strippedInput = strippedInput.replace(/^www\./, '');

  // Determine if input is a valid IP address or domain
  const isIP = isValidIP(strippedInput);
  const baseIPUrl = 'https://www.virustotal.com/gui/ip-address/';
  const baseDomainUrl = 'https://www.virustotal.com/gui/domain/';
  const talosUrl = 'https://www.talosintelligence.com/reputation_center/lookup?search=';
  const abuseIpDbUrl = 'https://www.abuseipdb.com/check/';
  const ipQualityScoreUrl = isIP ? 'https://www.ipqualityscore.com/ip-reputation-check/lookup/' : 'https://www.ipqualityscore.com/domain-reputation/';

  // Check if input is a valid IP address or domain
  if (!isValidIP(strippedInput) && !isValidDomain(strippedInput)) {
    showError(`"${strippedInput}" is not a valid IP address or domain.`);
    input.classList.add('error');
    return;
  }

  // Split the URLs by the new line character and open each URL in a new tab
  const urls = isIP ? `${baseIPUrl}${strippedInput}\n${talosUrl}${strippedInput}\n${abuseIpDbUrl}${strippedInput}\n${ipQualityScoreUrl}${strippedInput}` : `${baseDomainUrl}${strippedInput}\n${talosUrl}${strippedInput}\n${abuseIpDbUrl}${strippedInput}\n${ipQualityScoreUrl}${strippedInput}`;

  urls.split('\n').forEach((url) => {
    chrome.tabs.create({ url: url.trim() });
  });

  // Close the popup window
  window.close();
});

// Add event listener to input field to remove error class when text is entered
input.addEventListener('input', () => {
  input.classList.remove('error');
  document.querySelector('#error-message').textContent = '';
});

// Regular expression for validating an IP address
function isValidIP(ip) {
  const ipRegExp = /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/;
  return ipRegExp.test(ip);
}

// Regular expression for validating a domain name
function isValidDomain(domain) {
  const domainRegExp = /^[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}$/i;
  return domainRegExp.test(domain);
}

// Show an error message
function showError(message) {
  const errorMessage = document.querySelector('#error-message');
  errorMessage.textContent = message;
  errorMessage.style.color = 'red';
}
