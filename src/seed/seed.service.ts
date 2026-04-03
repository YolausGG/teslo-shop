import { BadRequestException, Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { initialData } from './seed';
import { Product, ProductImage } from 'src/products/entities';
import { ProductsService } from '../products/products.service';
import { PaginationDto } from 'src/common/dtos/pagination.dto';

@Injectable()
export class SeedService {

  constructor(
    private readonly productsService: ProductsService,
    private readonly dataSource: DataSource
  ) { }

  async runSeed() {
    await this.insertNewProducts()

    return 'Run execute'
  }

  private async deleteTables(){

  }

  private async insertNewProducts() {

    const queryRunner = this.dataSource.createQueryRunner()
    await queryRunner.connect()
    await queryRunner.startTransaction()

    try {

      const products = initialData.products;
      

      // await queryRunner.manager.delete(Product, {});
      if (products.length > 0) {
        // await this.productsService.deleteAllProducts()
      }

      const productsToInsert = initialData.products.map(({ images, ...product }) => {
        const prod = this.dataSource.manager.create(Product, {
          ...product,
          images: images.map(url => this.dataSource.manager.create(ProductImage, { url }))
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
