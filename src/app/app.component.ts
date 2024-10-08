import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ApiService } from './api.service';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule,ReactiveFormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  products: any[] = [];
  editProductVisibility: boolean = false;
  title: string = 'Products';
  searchControl = new FormControl('');
  productForm!: FormGroup;
  productEditForm!: FormGroup;

  editingProductId: number | null = null;
  editingProductName: string = 'Product Name';
  editingProductPrice: number = 130;

  constructor(private fb: FormBuilder, private apiService: ApiService) { }

  ngOnInit() {
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      price: ['', [Validators.required, Validators.min(1)]]
    });
    this.productEditForm = this.fb.group({
      name: ['', Validators.required],
      price: ['', [Validators.required, Validators.min(1)]]
    });

    this.getAllProducts()
  }

  getAllProducts() {
    this.apiService.getAllProducts().subscribe(
      (data) => {
        console.log(data);

        if (Array.isArray(data)) {
          this.products = data;
        } else {
          console.error('Expected an array but got:', data);
        }
      },
      (error) => {
        console.error('Error fetching products:', error);
      }
    );
  }


    onSearch() {
      let keyword: string = this.searchControl.value!;

    if (keyword.trim() === '') {
      // If search term is empty, load all products
      this.getAllProducts();
    } else {
      this.apiService.searchProducts(keyword).subscribe(
        (data) => {
          console.log(data);

          this.products = data;
        },
        (error) => {
          console.error('Error searching products:', error);
        }
      );
    }
  }

  onSubmit(): void {
    console.log('Submit');

    if (this.productForm.valid) {
      const newProduct = {
        name: this.productForm.value.name,
        price: this.productForm.value.price
      };

      // Call the service to create the product
      this.apiService.createProduct(newProduct).subscribe(
        (createdProduct) => {
          console.log('Product created successfully:', createdProduct);
          // After a successful creation, push the returned product into the array
          this.products.push(createdProduct);
          this.productForm.reset(); // Reset the form after adding
        },
        (error) => {
          console.error('Error creating product:', error);
        }
      );
    }
  }

  setProductEdit(productId: number){
    this.editingProductId = productId;
    this.editProductVisibility = true;

    const product = this.products.find(product => product.id === productId);



    if (product) {
      this.productEditForm.patchValue({
        name: product.name,
        price: product.price,
      });
    }
  }

  editProduct() {
    console.log(this.editingProductId);

    if (this.productEditForm.valid) {
      console.log(this.productEditForm);

      const newProduct = {
        id: this.editingProductId,
        name: this.productEditForm.value.name,
        price: this.productEditForm.value.price
      };

      console.log(newProduct);

      this.apiService.updateProduct(newProduct).subscribe(
        (response) => {
          console.log('Product updated successfully:', response);

          // Update the product in the local products array
          const index = this.products.findIndex(product => product.id === this.editingProductId);
          if (index !== -1) {
            this.products[index] = { ...this.products[index], ...newProduct }; // Update the existing product
          }

          // Hide the edit form and reset the form
          this.editProductVisibility = false;
          this.productForm.reset(); // Reset the form after editing
        },
        (error) => {
          console.error('Error updating product:', error);
        }
      );


    }

  }


  deleteProduct(index: number, productId: number) {
    // Call the API to delete the product
    this.apiService.deleteProduct(productId).subscribe(
      () => {
        this.products.splice(index, 1);
      },
      (error) => {
        console.error('Error deleting product:', error);
      }
    );
  }







}