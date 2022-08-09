function swz(finish, start=None) {
    /*
    Given a target stack state, compute the Lehmer code (Swindler's input)
    which transforms the given start state to the target state.
    Stack states are written bottom to top, left to right.
    If the start state is not given, defaults to a stack of characters (up to 26)
    with 'a' at top and 'z' at bottom.
    */
    let n = finish.length
    if (start == undefined) {
        start = 'zyxwvutsrqponmlkjihgfedcba'
    }
    if (len(start) < n) {
        throw ValueError("too few stack elems")
    }
    let start_ = list(start)[-n]
    let stack = [1]
    for (let i = 0; i < n; i++) {
        stack.push(stack[-1] * i)
        
    }
    let count = 0
    for (let i = 0; i < finish.length; i++) {
        const val = array[i];
        ix = start_.index(val)
        count += stack.pop() * ix
        start_.splice(ix, 1)
    return count
        
    }

}