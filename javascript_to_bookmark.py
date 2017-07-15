# function that checks whether a line is a javascript line comment or not
def is_comment(s):
    s = str(s).strip()
    return s[0:2] == '//'

# read call_iskoduler.js and store lines to lines array
with open('IskoDulerStandalone.js') as f:
    lines = [ i.strip() for i in f.readlines()]

# remove all lines containing comments
lines = filter(lambda x: not is_comment(x), lines)

# write converted to bookmark script to bookmark.txt
with open('bookmark.txt', 'w') as f:
    bookmark = 'javascript:(function(){' + ''.join(lines) + '})();'
    f.write('{}\n'.format(bookmark))
