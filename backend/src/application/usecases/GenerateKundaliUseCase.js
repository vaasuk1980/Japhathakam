import IUseCase from "../contracts/IUseCase.js";
import GenerateKundaliResponse from "../responses/GenerateKundaliResponse.js";

export default class GenerateKundaliUseCase extends IUseCase {

    constructor({
        kundaliBuilder,
        kundaliAssembler,
        kundaliRepository
    }) {

        super();

        this.kundaliBuilder = kundaliBuilder;
        this.kundaliAssembler = kundaliAssembler;
        this.kundaliRepository = kundaliRepository;

    }

    async execute(request) {

        const domainKundali =
            this.kundaliBuilder.build(request);

        const kundali =
            this.kundaliAssembler.assemble(domainKundali);

        if (this.kundaliRepository) {

            await this.kundaliRepository.save(domainKundali);

        }

        return new GenerateKundaliResponse({
            kundali
        });

    }

}