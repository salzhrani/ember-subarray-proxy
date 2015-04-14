import Ember from 'ember';
import SubarrayProxy from 'ember-subarray-proxy';
import { module, test } from 'qunit';

module('SubarrayProxy');

// Replace this with your real tests.
test('it works', function(assert) {
  var result = SubarrayProxy;
  assert.ok(result);
  assert.ok(typeof result === 'function');
});

test('content is initialized', function (assert) {
  var arr = Ember.A(['a', 'b', 'c']);
  var slice = SubarrayProxy.create({
    content: arr
  });
  assert.equal(slice.get('arrangedContent.length'), 3);
  assert.equal(slice.get('content.length'), 3);
  assert.equal(slice.get('length'), 3);
  assert.equal(slice.get('arrangedContent').join(''), 'abc');
});

test('offset defaults to zero', function (assert) {
  var slice = SubarrayProxy.create({
    content: Ember.A(['a', 'b', 'c'])
  });
  assert.equal(slice.get('offset'), 0);
});

test('offset can be initialized', function (assert) {
  var slice = SubarrayProxy.create({
    content: Ember.A(['a', 'b', 'c']),
    offset: 2
  });
  assert.equal(slice.get('offset'), 2);
});

test('arranged content matches original content', function (assert) {
  var slice = SubarrayProxy.create({
    content: Ember.A(['a', 'b', 'c']),
    offset: 2
  });
  assert.equal(slice.objectAt(0), 'c');
});


test('arranged content length does not exceed limit', function (assert) {
  var slice = SubarrayProxy.create({
    content: Ember.A(['a', 'b', 'c']),
    limit: 2
  });
  assert.equal(slice.get('length'), 2);
});

test('offset can be updated', function (assert) {
  var slice = SubarrayProxy.create({
    content: Ember.A(['a', 'b', 'c'])
  });
  assert.equal(slice.objectAt(0), 'a');
  assert.equal(slice.get('length'), 3);
  slice.set('offset', 1);
  assert.equal(slice.objectAt(0), 'b');
  assert.equal(slice.get('length'), 2);
  slice.set('offset', 2);
  assert.equal(slice.objectAt(0), 'c');
  assert.equal(slice.get('length'), 1);
});

test('offset can be updated with limit set', function (assert) {
  var slice = SubarrayProxy.create({
    content: Ember.A(['a', 'b', 'c', 'd', 'e', 'f']),
    limit: 3
  });
  assert.equal(slice.objectAt(0), 'a');
  assert.equal(slice.get('length'), 3);
  slice.set('offset', 1);
  assert.equal(slice.objectAt(0), 'b');
  assert.equal(slice.get('length'), 3);
  slice.set('offset', 2);
  assert.equal(slice.objectAt(0), 'c');
  assert.equal(slice.get('length'), 3);
});

test('content array unshift', function (assert) {
  var arr = ['a', 'b', 'c'];
  var slice = SubarrayProxy.create({
    content: Ember.A(arr),
    offset: 1
  });
  assert.equal(slice.objectAt(0), 'b');
  assert.equal(slice.get('length'), 2);
  arr.unshiftObject('x');
  assert.equal(slice.objectAt(0), 'a');
  assert.equal(slice.get('length'), 3);
});

test('content array unshift completely', function (assert) {
  var arr = ['a', 'b', 'c'];
  var slice = SubarrayProxy.create({
    content: Ember.A(arr),
    offset: 1,
    limit: 3
  });
  assert.equal(slice.objectAt(0), 'b');
  assert.equal(slice.get('length'), 2);
  arr.unshiftObjects(['x','y','z']);
  assert.equal(slice.objectAt(0), 'y');
  assert.equal(slice.get('length'), 3);
});

test('content array insert at middle', function (assert) {
  var arr = ['a', 'b', 'c'];
  var slice = SubarrayProxy.create({
    content: Ember.A(arr),
    offset: 1,
    limit: 3
  });
  assert.equal(slice.objectAt(0), 'b');
  assert.equal(slice.get('length'), 2);
  arr.insertAt(2, 'd');
  assert.equal(slice.objectAt(0), 'b');
  assert.equal(slice.objectAt(1), 'd');
  assert.equal(slice.objectAt(2), 'c');
  assert.equal(slice.get('length'), 3);
});

test('content array inserted after subarray range', function (assert) {
  var arr = ['a', 'b', 'c'];
  var slice = SubarrayProxy.create({
    content: Ember.A(arr),
    offset: 1,
    limit: 2
  });
  assert.equal(slice.objectAt(0), 'b');
  assert.equal(slice.get('length'), 2);
  arr.pushObjects(['x', 'y', 'z']);
  assert.equal(slice.objectAt(0), 'b');
  assert.equal(slice.objectAt(1), 'c');
  assert.equal(slice.get('length'), 2);
});

test('content array poped at 0', function (assert) {
  var arr = ['a', 'b', 'c'];
  var slice = SubarrayProxy.create({
    content: Ember.A(arr),
    offset: 0,
    limit: 2
  });
  assert.equal(slice.objectAt(0), 'a');
  assert.equal(slice.get('length'), 2);
  arr.shiftObject();
  assert.equal(slice.objectAt(0), 'b');
  assert.equal(slice.objectAt(1), 'c');
  assert.equal(slice.get('length'), 2);
});

test('content array less than limit', function (assert) {
  var arr = ['a', 'b', 'c'];
  var slice = SubarrayProxy.create({
    content: Ember.A(arr),
    offset: 0,
    limit: 2
  });
  assert.equal(slice.objectAt(0), 'a');
  assert.equal(slice.get('length'), 2);
  arr.shiftObject();
  arr.shiftObject();
  assert.equal(slice.objectAt(0), 'c');
  assert.equal(slice.get('length'), 1);
});

test('content array poped than limit', function (assert) {
  var arr = ['a', 'b', 'c', 'x', 'y', 'z'];
  var slice = SubarrayProxy.create({
    content: Ember.A(arr),
    offset: 0,
    limit: 3
  });
  assert.equal(slice.objectAt(0), 'a');
  assert.equal(slice.get('length'), 3);
  arr.shiftObject();
  arr.shiftObject();
  arr.shiftObject();
  assert.equal(slice.objectAt(0), 'x');
  assert.equal(slice.get('length'), 3);
  arr.shiftObject();
  assert.equal(slice.objectAt(0), 'y');
  assert.equal(slice.get('length'), 2);
});


test('limit can be updated', function (assert) {
  var arr = ['a', 'b', 'c', 'x', 'y', 'z'];
  var slice = SubarrayProxy.create({
    content: Ember.A(arr),
    offset: 0,
    limit: 3
  });
  assert.equal(slice.objectAt(0), 'a');
  assert.equal(slice.get('length'), 3);
  slice.set('limit', 4);
  assert.equal(slice.objectAt(0), 'a');
  assert.equal(slice.objectAt(3), 'x');
  assert.equal(slice.get('length'), 4);
});

