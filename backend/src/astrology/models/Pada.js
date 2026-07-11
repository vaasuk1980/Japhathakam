class Pada {

    constructor(
        number,
        startOffset,
        endOffset
    ) {

        this.number = number;

        this.startOffset = startOffset;
        this.endOffset = endOffset;

        Object.freeze(this);

    }

}

export default Pada;