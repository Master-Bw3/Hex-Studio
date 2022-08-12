function sig_from_command(command) {
    return Object.keys(PATTERNS).find(key => PATTERNS[key] === command);
}

export default sig_from_command