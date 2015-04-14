# Ember-subarray-proxy

This is an implementation of of `Ember.ArrayProxy` that allow for getting a slice of an array that is DOM friendly and efficient. If the content array changes the proxy doesn't tear down and rebuild the proxy, instead it conveys the actual changes if any.

This project is inspired by [ember-cli-array-slice](https://github.com/j-/ember-cli-array-slice)

## Example

```js
import SubarrayProxy from 'ember-subarray-proxy';

var slice = SubarrayProxy.create({
  content: Ember.A(['a', 'b', 'c']),
  limit: 2
});

slice.get('length') // 2
slice.get('content.length') // 3

```

## Installation

`npm install ember-subarray-proxy --save-dev`

## Running Tests

* `ember test`
* `ember test --server`

