import requests
from bs4 import BeautifulSoup

url = "https://www.aswakassalam.com/"
response = requests.get(url, timeout=10)
soup = BeautifulSoup(response.text, 'html.parser')

products = soup.find_all('div', class_=lambda c: c and 'product-inner' in c.lower())
if not products:
    products = soup.find_all('li', class_=lambda c: c and 'product' in c.lower())

print(f"Found {len(products)} products on homepage.")

for p in products[:5]:
    title_elem = p.find(['h2', 'h3'])
    title = title_elem.text.strip() if title_elem else "Unknown"
    
    price_elem = p.find(class_='woocommerce-Price-amount')
    price = price_elem.text.strip() if price_elem else "Unknown"
    
    print(f"{title} -> {price}")
