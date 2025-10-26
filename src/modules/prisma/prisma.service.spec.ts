import { Test, TestingModule } from '@nestjs/testing';
import { Logger } from '@nestjs/common';
import { PrismaService } from './prisma.service';

describe('src :: modules :: prisma :: prisma.service.ts', () => {
	let prismaService: PrismaService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [PrismaService],
		}).compile();

		prismaService = module.get<PrismaService>(PrismaService);

		prismaService.$connect = jest.fn().mockResolvedValue(undefined) as any;
		prismaService.$disconnect = jest.fn().mockResolvedValue(undefined) as any;

		jest.spyOn(Logger, 'log').mockImplementation(() => {});
	});

	afterEach(() => {
		jest.restoreAllMocks();
	});

	it('should be defined', () => {
		expect(prismaService).toBeDefined();
	});

	describe('#onModuleInit', () => {
		it('calls $connect and logs connection message', async () => {
			await prismaService.onModuleInit();

			expect(prismaService.$connect).toHaveBeenCalledTimes(1);
			expect(Logger.log).toHaveBeenCalledWith('Connected to Prisma', 'PrismaService');
		});
	});

	describe('#onModuleDestroy', () => {
		it('calls $disconnect and logs disconnect message', async () => {
			await prismaService.onModuleDestroy();

			expect(prismaService.$disconnect).toHaveBeenCalledTimes(1);
			expect(Logger.log).toHaveBeenCalledWith('Closing Prisma Connection', 'PrismaService');
		});
	});
});
