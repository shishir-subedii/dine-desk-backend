import {
  Body,
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  UseFilters,
  Req,
  UseGuards,
  Get,
  Query,
  ParseIntPipe,
  DefaultValuePipe,
  Param,
  Delete,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';

import { MenuService } from './menu.service';
import { MulterExceptionFilter } from 'src/common/filters/multer-exception.filter';

import { userPayloadType } from 'src/common/types/auth.types';
import { UploadFolder } from 'src/common/enums/file-upload.enum';
import { getFileInterceptor } from 'src/file-upload/file-upload.utils';
import { CreateMenuItemDto } from './dto/create-menu.dto';
import { Roles } from 'src/common/auth/AuthRoles';
import { UserRole } from 'src/common/enums/auth-roles.enum';
import { FileUploadService } from 'src/file-upload/file-upload.service';
import { JwtAuthGuard } from 'src/common/auth/AuthGuard';
import { paginateResponse } from 'src/common/pagination/pagination.helper';
import { MenuItem } from './entities/menu.entity';

@ApiTags('Menu')
@Controller('menu')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@Roles(UserRole.RESTAURANT_OWNER, UserRole.STAFF)
export class MenuController {
  constructor(
    private readonly menuService: MenuService,
    private readonly fileUploadService: FileUploadService,
  ) { }

  @Post('create')
  @Roles(UserRole.RESTAURANT_OWNER, UserRole.STAFF)
  @UseInterceptors(getFileInterceptor('file', UploadFolder.MENUS))
  @UseFilters(MulterExceptionFilter)
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Create a menu item with image upload' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string', example: 'Paneer Butter Masala' },
        description: { type: 'string', example: 'Rich and creamy paneer curry' },
        price: { type: 'number', example: 250 },
        category: { type: 'string', enum: ['veg', 'non_veg', 'egg'], example: 'veg' },
        restaurantId: { type: 'string', example: 'uuid-of-restaurant' },
        file: { type: 'string', format: 'binary' }, // This is the file input
      },
      required: ['name', 'price', 'restaurantId', 'file'],
    },
  })
  async createMenu(
    @UploadedFile() file: Express.Multer.File,
    @Body() dto: CreateMenuItemDto,
    @Req() req,
  ) {
    const user = req.user as userPayloadType;
    const fileUrl = await this.fileUploadService.getFileUrl(req, file, UploadFolder.MENUS);
    const data = await this.menuService.createMenu(dto, fileUrl, user);
    return {
      success: true,
      message: 'Menu item created successfully',
      data,
    }
  }

  //get all menu items for a restaurant with pagination
  @Get('restaurant/:restaurantId')
  @ApiOperation({ summary: 'Get paginated menu items of a restaurant' })
  @ApiParam({ name: 'restaurantId', required: true, description: 'UUID of the restaurant' })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
  async getMenuItems(
    @Req() req,
    @Param('restaurantId') restaurantId: string, // <-- use @Param here
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
  ) {
    const user = req.user as userPayloadType;
    const { data, total } = await this.menuService.getMenuItems(restaurantId, user, page, limit);
    const paginated = paginateResponse(data, total, page, limit, req);
    return {
      success: true,
      message: 'Menu items fetched successfully',
      data: paginated,
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single menu item by ID' })
  @ApiParam({ name: 'id', required: true, description: 'UUID of the menu item' })
  @ApiResponse({ status: 200, description: 'Menu item retrieved successfully', type: MenuItem })
  @ApiResponse({ status: 404, description: 'Menu item not found' })
  async getMenuById(@Req() req, @Param('id') id: string) {
    const user = req.user as userPayloadType;
    const menuItem = await this.menuService.findMenuById(id, user);

    return {
      success: true,
      message: 'Menu item retrieved successfully',
      data: menuItem,
    };
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a menu item by ID' })
  @ApiParam({ name: 'id', required: true, description: 'UUID of the menu item to delete' })
  @ApiResponse({ status: 200, description: 'Menu item deleted successfully' })
  @ApiResponse({ status: 404, description: 'Menu item not found' })
  async deleteMenu(@Req() req, @Param('id') id: string) {
    const user = req.user as userPayloadType;
    const result = await this.menuService.deleteMenuById(id, user);

    return {
      success: true,
      message: result.message,
      data: null, // no data to return
    };
  }
}