import os
path = os.path.expanduser('~/pharmacy-frontend/src/pages/ProductDetailPage.jsx')
code = open(path).read()
print("Line 55:", repr(code.split('\n')[54]))
print("Line 2253:", repr(code.split('\n')[2252] if len(code.split('\n')) > 2252 else "N/A"))
print("Total lines:", len(code.split('\n')))
