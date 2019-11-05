# i4atom package

Our workflow in atom

## Installation

```
apm install git@github.com:i4a/i4atom
```

## Configuration

You must provide [i4atom](https://github.com/i4a/i4atom) with a Trello key and token. The package will lead you to setting them from its configuration section.

## Trello conventions

### List names

[i4atom](https://github.com/i4a/i4atom) will look for a list in each board with the name `✏️ In Progress`

### Pull request detection

[i4atom](https://github.com/i4a/i4atom) looks for a string in the form of `PR: <url>`

## Development

You can make atom use a local copy of the repository with

1. Remove `i4atom` if it is already installed

```
apm rm i4atom
```

2. Clone [this repository](https://github.com/i4a/i4atom)

```
git clone git@github.com:i4a/i4atom.git
```

3. Go to your local atom packages folder

```
cd ~/.atom/packages
```

4. Link the package

```
ln -s <path/to/cloned/i4atom>
```

5. Restart atom

### JSHint

Install the [JSHint](https://atom.io/packages/jshint) package for linting support
