# i4atom package

Our workflow in atom

## Installation

1. Clone [this repository](https://github.com/i4a/i4atom)

```
git clone git@github.com:i4a/i4atom.git
```


2. Go to your local atom packages folder

```
cd ~/.atom/packages
```

3. Link the package

```
ln -s <path/to/cloned/i4atom>
```

4. Restart atom

## Configuration

You must provide [i4atom](https://github.com/i4a/i4atom) with a Trello key and token. The package will lead you to setting them from its configuration section.

## Trello conventions

### List names

[i4atom](https://github.com/i4a/i4atom) will look for a list in each board with the name `✏️ In Progress`

### Pull request detection

[i4atom](https://github.com/i4a/i4atom) looks for a string in the form of `PR: <url>`
