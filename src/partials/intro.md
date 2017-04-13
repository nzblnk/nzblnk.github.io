# The NZBLNK URI scheme

 The NZBLNK™ URI scheme defines the format of NZBLNK™ links to identify
 binary Usenet content and supplies some extra information to handle
 that content correct.
 
 The idea behind the creation of the NZBLNK™ scheme is need of a computer
 readable, modern approach to supply a unique reference to binary usenet
 information. The reference should follow these rules:
  
 - It must be in a URI scheme so it will be clickable in a browser (direct out of
   a website)
 - It must be computer readable (implied by a URI)
 - All relevant data to handle the binary content should be included
 
 
 The inspiration for the NZBLNK™ was the prominent "magnet link" which works
 perfect for BitTorrent.
 
## The URI format

NZBLNK™ URI consist of a series of two or more parameters, the order of
which is not significant, formatted in the same way as query strings that
ordinarily terminate HTTP URLs.

```
nzblnk:?t=Our+Sommervacation&h=fbzzreinpngvba&g=a.b.documentaries&p=v4c4t10n4tw1n
```

The segments are:

- `nzblnk:?` - URI scheme    
  
  The scheme without the authority (authentication, host) and path part.
  Followed by the parameter separator.  
  
  
- `t` - mandatory "title" parameter  

  A title for the content, which will be used by the client software to label
  the download.  


- `h` - mandatory "header" parameter

  The header parameter is used to identify the binary content. It can contain only
  a part of the full header information. It must be enough to prevent double hits
  on a search in the header pool.


- `g` - optional "group" parameter

  Specifies the usenet group to search in. To specify more then one group, the
  parameter can be used multiple times.  


- `p` - optional "password" parameter

  If a password is needed to decrypt the binary content it can be passed here.
  
   