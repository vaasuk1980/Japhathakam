import IUseCase from '../contracts/IUseCase.js';
import GenerateKundaliResponse from '../responses/GenerateKundaliResponse.js';

export default class GenerateKundaliUseCase extends IUseCase {

    constructor({
        astronomyProvider,
        japhathakamService,
        kundaliRepository
    }) {
        super();

        this.astronomyProvider = astronomyProvider;
        this.japhathakamService = japhathakamService;
        this.kundaliRepository = kundaliRepository;
    }

    execute(request) {
        throw new Error('Not implemented.');
    }

}