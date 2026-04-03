import { BeforeInsert, BeforeUpdate, Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ProductImage } from './';
import { User } from '../../auth/entities/user.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity({ name: 'products' })
export class Product {

    @ApiProperty({
        example: '83a2269b-b135-4128-b18d-e8bdc3d7be34',
        description: 'Product ID',
        uniqueItems: true
    })
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ApiProperty({
        example: 'T-Shirt Teslo',
        description: 'Product Title',
        uniqueItems: true
    })
    @Column('text', {
        unique: true,
    })
    title: string;

    @ApiProperty({
        example: 0,
        description: 'Product price',
        default: 0
    })
    @Column('float', {
        default: 0
    })
    price: number;

    @ApiProperty({
        example: 'This is a product description',
        description: 'Product Description',
        nullable: true
    })
    @Column({
        type: 'text',
        nullable: true
    })
    description: string;

    @ApiProperty({
        example: 't_shirt_teslo',
        description: 'Product slug',
        uniqueItems: true
    })
    @Column('text', {
        unique: true
    })
    slug: string;

    @ApiProperty({
        example: 0,
        description: 'Product stock',
        default: 0
    })
    @Column('int', {
        default: 0
    })
    stock: number;

    @ApiProperty({
        example: ['XS','S','M','XL','XXL'],
        description: 'Product sizes',
        isArray: true
    })
    @Column('text', {
        array: true
    })
    sizes: string[];

    @ApiProperty({
        example: 'men',
        description: 'Product gender',
    })
    @Column('text')
    gender: string;

    @ApiProperty({
        example: ['shirt'],
        description: 'Product tags',
        default: [],
        isArray: true
    })
    @Column('text', {
        array: true,
        default: []
    })
    tags: string[];

    @ApiProperty({
        example: 'shirts',
        description: 'Product type',
    })
    @Column({
        type: 'text'
    })
    type: string;

    // images
    @ApiProperty({
        example: ['1740176-00-A_0_2000.jpg'],
        description: 'Product images',
        isArray: true
    })
    @OneToMany(
        () => ProductImage,
        (productImage) => productImage.product,
        { cascade: true, eager: true }
    )
    images?: ProductImage[];

    @ManyToOne(
        () => User,
        (user) => user.product,
        { eager: true }
    )
    user: User

    @BeforeInsert()
    checkSlugInsert() {

        if (!this.slug) {
            this.slug = this.title;
        }

        this.slug = this.slug
            .toLowerCase()
            .replaceAll(' ', '_')
            .replaceAll("'", '')

    }

    @BeforeUpdate()
    checkSlugUpdate() {
        this.slug = this.slug
            .toLowerCase()
            .replaceAll(' ', '_')
            .replaceAll("'", '')
    }


}