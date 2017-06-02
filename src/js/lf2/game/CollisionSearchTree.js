"use strict";
var lf2 = (function (lf2) {
    const Rectangle = lf2.Rectangle;

    class Node {
        /**
         *
         * @param {lf2.Rectangle} value
         * @param {Node} parent
         * @param {lf2.CollisionSearchTree} tree
         */
        constructor(value, parent, tree) {
            this.value = new Rectangle(value);
            this.parent = parent || null;
            this.left = this.right = null;
            this.tree = tree;
        }

        /**
         *
         * @param {lf2.Rectangle} value
         * @param {Node} parent
         */
        add(value, parent) {
            const collisionResult = value.isIntersect(this.value);
            if (collisionResult && !this.isLeaf) { //如果有交集
                // const collisionLeft = this.left!==null && value.isIntersect(this.left.value);
                // const collisionRight = this.right!==null && value.isIntersect(this.right.value);

                const leftRectAfterMerge = this.left !== null ? Rectangle.merge(this.left.value, value) : value;
                const rightRectAfterMerge = this.right !== null ? Rectangle.merge(this.right.value, value) : value;

                const leftAreaDiff = this.left !== null ? leftRectAfterMerge.area - this.left.area : leftRectAfterMerge.area;
                const rightAreaDiff = this.right !== null ? rightRectAfterMerge.area - this.right.area : rightRectAfterMerge.area;

                if (leftAreaDiff <= rightAreaDiff) {
                    if (this.left === null) {
                        this.left = new Node(value, this, this.tree);
                        this._ReArrange(this.left);
                    } else {
                        this.left.add(value, this.left);
                    }
                } else {
                    if (this.right === null) {
                        this.right = new Node(value, this, this.tree);
                        this._ReArrange(this.right);
                    } else {
                        this.right.add(value, this.right);
                    }
                }
            } else {
                const mergedRect = Rectangle.merge(value, this.value);
                let newNode = new Node(mergedRect, parent, this.tree);
                const valueNode = new Node(value, newNode, this.tree);
                const mostLeftNode = (this.value.position.x > valueNode.value.position.x) ? valueNode : this;
                const anotherNode = mostLeftNode === this ? valueNode : this;

                newNode.left = mostLeftNode;
                newNode.right = anotherNode;

                if (this.parent === null) { //root?
                    newNode.parent = null;
                    this.tree.root = newNode;
                } else if (this.parent.left === this) {
                    this.parent.left = newNode;
                } else {
                    this.parent.right = newNode;
                }
                newNode.left.parent = newNode.right.parent = newNode;

                this._ReArrange(newNode);
            }
        }

        has(value) {
            if (value < this.value) {
                if (this.left) return this.left.has(value);
                else return false;
            } else if (value > this.value) {
                if (this.right) return this.right.has(value);
                else return false;
            } else if (value === this.value) {
                return true;
            }
        }

        get isLeaf() {
            return this.left === null && this.right === null;
        }

        /*
         delete(value, parent, which) {
         if (value < this.value) {
         if (this.left) this.left.delete(value, this, 'left');
         } else if (value > this.value) {
         if (this.right) this.right.delete(value, this, 'right');
         } else if (value === this.value) {
         if (this.left) {
         let node = this.left;
         while (node.right) node = node.right;
         this.value = node.value;
         this.left.delete(this.value, this, 'left');
         } else if (this.right) {
         let node = this.right;
         while (node.left) node = node.left;
         this.value = node.value;
         this.right.delete(this.value, this, 'right');
         } else {
         delete parent[which];
         }
         }
         }
         */

        *[Symbol.iterator]() {
            if (this.left) yield* this.left;
            yield this.value;
            if (this.right) yield* this.right;
        }

        /**
         * 
         * @param {any} baseNode
         */
        _ReArrange(baseNode) {
            baseNode = baseNode.parent;
            const getRect = (node) => node ? node.value : null;
            while (baseNode) {
                let mergedRect = Rectangle.merge(getRect(baseNode.left), getRect(baseNode.right));
                console.log(mergedRect);
                baseNode.value = mergedRect;

                baseNode = baseNode.parent;
            }
        }
    }
    ;

    /**
     * Tree
     *
     * @class lf2.CollisionSearchTree
     */
    lf2.CollisionSearchTree = class CollisionSearchTree {
        /**
         *
         * @param {lf2.Rectangle} value
         */
        add(value) {
            if (this.root) this.root.add(value, this.root);
            else this.root = new Node(value, null, this);
        }

        has(value) {
            if (this.root) return this.root.has(value);
            else return false;
        }

        /*
         delete(value) {
         if (this.root) this.root.delete(value, this, 'root');
         }
         */

        *[Symbol.iterator]() {
            if (this.root) yield* this.root;
        }
    };

    return lf2;
})(lf2 || {});