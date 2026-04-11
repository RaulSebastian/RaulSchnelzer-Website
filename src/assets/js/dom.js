/**
 * @param {string} sel
 * @param {ParentNode} [ctx=document]
 */
export const $ = (sel, ctx = document) => ctx.querySelector(sel);

/**
 * @param {string} sel
 * @param {ParentNode} [ctx=document]
 */
export const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];
