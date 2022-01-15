# TabLock
### ***Save*** tabs with ***security***
<pre>
1. Introduction
</pre>

TabLock is a chrome extension that allows you to safely save you sensitve tabs and websites with password protection. Developed by David Durdaller (Carnegie Mellon University '24) and [Shahood Ahmad][1] (Lehigh University '24), TabLock improves on Chrome's built-in bookmark feature by adding password protection and an intuitive UI so user can feel safe saving their tabs and easly navigate saved tabs and windows 

<pre>
2. Usage
</pre>
- Save
    -  Use the "+ save tab" button to save the current tab that is active 
    - Use the "+ save window" button to save all tabs in the current Chrome window as a group
    - Enter a name (up to 10 characters) and a password to lock the tab/window 
- Use or delete
    - Naviagate to the tab/window you want to access
    - Click the button and enter you password for that tab/window to open the tab(s)
    - Click the "x" on the right side of the button to delete (the tab(s) saved there will no longer be saved)

<pre>
3. Features
</pre>
- Password protection
    - Allowing users to have a password secure their saved tabs given then confidence to simpley save their websites for later use as well as save sensitve URLs with information for more protection
- Broweser security features
    - URLs are saved in browser, encrypted with Advanced Encryption Standard using JavaScript's [CryptoJS][2] library
    - Passwords are [salted][3] and hashed ([sha256][4]) for maximum protection when saved in browser
- Intuitive UI
    - The UI offers a easy user experience where uers feel confortable saving and securing their tabs long term with a password
    - The layout offers seperation between single tabs saved and mutiple tabs (window) saved under one group. 
 


[1]: https://www.linkedin.com/in/shahood-ahmad/
[2]: https://www.npmjs.com/package/crypto-js
[3]: https://en.wikipedia.org/wiki/Salt_(cryptography)
[4]: https://en.wikipedia.org/wiki/SHA-2