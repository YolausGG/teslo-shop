import { BadRequestException, Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { initialData } from './seed';
import { Product, ProductImage } from 'src/products/entities';
import { ProductsService } from '../products/products.service';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/auth/entities/user.entity';

@Injectable()
export class SeedService {

  constructor(
    private readonly productsService: ProductsService,
    private readonly dataSource: DataSource,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) { }

  async runSeed() {

    await this.deleteTables()

    const adminUser = await this.insertUsers()

    await this.insertNewProducts2(adminUser)

    return 'Run execute'
  }

  private async deleteTables() {

    await this.productsService.deleteAllProducts();

    const queryBuilder = this.userRepository.createQueryBuilder();
    await queryBuilder
      .delete()
      .where({})
      .execute()

  }

  private async insertUsers() {

    const seedUsers = initialData.users;

    const users: User[] = []

    seedUsers.forEach(user => {
      users.push(this.userRepository.create(user))
    });

    const dbUsers = await this.userRepository.save(users);

    return dbUsers[0];

  }
  private async insertNewProducts2(user: User) {
    await this.productsService.deleteAllProducts();

    const products = initialData.products;

    const insertPromises:Object[] = [];

    products.forEach(async product => {
      const prodDB = await this.productsService.create(product, user)
      console.log(prodDB);
      if (prodDB != undefined) {
        insertPromises.push(prodDB);
      }
    });

    await Promise.all(insertPromises);


    return true;
  }
  private async insertNewProducts(user: User) {

    const queryRunner = this.dataSource.createQueryRunner()
    await queryRunner.connect()
    await queryRunner.startTransaction()

    try {

      const products = initialData.products;

      // await queryRunner.manager.delete(Product, {});
      if (products.length > 0) {
        await this.productsService.deleteAllProducts()
      }

      const productsToInsert = initialData.products.map(({ images, ...product }) => {
        const prod = this.dataSource.manager.create(Product, {
          ...product,
          images: images.map(url => this.dataSource.manager.create(ProductImage, { url })),
          // user
        });
        return prod;
      });


      await queryRunner.manager.save(Product, productsToInsert);

      await queryRunner.commitTransaction()
      await queryRunner.release()

      // Delete all existing products
      // await queryRunner.manager.delete(Product, {});

      // const productsToInsert = initialData.products.map(({ images, ...product }) => {
      //   const prod = queryRunner.manager.create(Product, {
      //     ...product,
      //     images: images.map(url => queryRunner.manager.create(ProductImage, { url }))
      //   });
      //   return prod;
      // });
    } catch (error) {

      await queryRunner.rollbackTransaction()
      await queryRunner.release()
      throw new BadRequestException(error)

    }


    return true;
  }

  // await this.productsService.deleteAllProducts();

  // const products = initialData.products;

  // const insertPromises: Product[] = [];

  // products.forEach(async product => {

  //   const prod = await this.productsService.create(product);
  //   insertPromises.push(prod);
  // })

  // await Promise.all(insertPromises);

  // return true
  // }

}
