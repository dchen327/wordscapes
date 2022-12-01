# %%
import requests
from bs4 import BeautifulSoup
import pandas as pd

URL = 'https://www.payscale.com/college-salary-report/bachelors'
r = requests.get(URL)

# If this line causes an error, run 'pip install html5lib' or install html5lib
soup = BeautifulSoup(r.content, 'html5lib')
table = soup.find("table", {"class": "data-table"})
table_body = table.find('tbody')

# %%
header = ['Rank', 'School Name', 'School Type',
          'Early Career Pay', '% High Meaning', '% STEM Degrees']

# %%
data = []
rows = table_body.find_all('tr')
for row in rows:
    cols = row.find_all('td')
    row_data = []
    for col in cols:
        value = col.find('span', {'class': 'data-table__value'}).text.strip()
        row_data.append(value)
    data.append(row_data)

df = pd.DataFrame(data, columns=header)
df.head()
